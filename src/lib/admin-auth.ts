import { createHmac, randomUUID, scrypt as nodeScrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getData, updateData } from './api';
import { AdminPermission, AdminUser, AdminUserInput, AdminUserProfile } from './types';
import { ADMIN_PERMISSIONS, hasAdminPermission, normalizeAdminPermissions } from './admin-permissions';

const scrypt = promisify(nodeScrypt);

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const DEFAULT_OWNER_ID = 'owner-admin';

interface SessionPayload {
  userId: string;
  exp: number;
}

export class AuthError extends Error {
  status: number;

  constructor(message: string, status = 401) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

export class PermissionError extends Error {
  status: number;

  constructor(message: string, status = 403) {
    super(message);
    this.name = 'PermissionError';
    this.status = status;
  }
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.BLOB_READ_WRITE_TOKEN || process.env.ADMIN_PASSWORD || 'local-admin-session-secret';
}

function encodeBase64Url(input: string) {
  return Buffer.from(input, 'utf8').toString('base64url');
}

function decodeBase64Url(input: string) {
  return Buffer.from(input, 'base64url').toString('utf8');
}

function signPayload(payload: string) {
  return createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
}

function createSessionToken(userId: string) {
  const payload = encodeBase64Url(JSON.stringify({
    userId,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  } satisfies SessionPayload));

  return `${payload}.${signPayload(payload)}`;
}

function readSessionToken(token: string): SessionPayload | null {
  const [payload, signature] = token.split('.');

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const decoded = JSON.parse(decodeBase64Url(payload)) as SessionPayload;

    if (!decoded.userId || decoded.exp < Date.now()) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

function sanitizeUser(user: AdminUser): AdminUserProfile {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

function validatePassword(password: string) {
  const trimmed = password.trim();

  if (trimmed.length < 8) {
    throw new AuthError('Password must be at least 8 characters long.', 400);
  }

  return trimmed;
}

async function hashPassword(password: string) {
  const salt = randomUUID().replace(/-/g, '');
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

async function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(':');

  if (!salt || !key) {
    return false;
  }

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  const keyBuffer = Buffer.from(key, 'hex');

  if (derivedKey.length !== keyBuffer.length) {
    return false;
  }

  return timingSafeEqual(derivedKey, keyBuffer);
}

async function createBootstrapOwnerUser() {
  const now = new Date().toISOString();
  const username = normalizeUsername(process.env.ADMIN_USERNAME || 'admin');
  const password = validatePassword(process.env.ADMIN_PASSWORD || 'password123');

  return {
    id: DEFAULT_OWNER_ID,
    name: 'Primary Owner',
    username,
    passwordHash: await hashPassword(password),
    permissions: [...ADMIN_PERMISSIONS],
    isActive: true,
    isOwner: true,
    createdAt: now,
    updatedAt: now,
  } satisfies AdminUser;
}

async function ensureUserStore() {
  const data = await getData();
  const users = Array.isArray(data.users) ? data.users : [];

  if (users.length > 0) {
    return { data, users };
  }

  const ownerUser = await createBootstrapOwnerUser();
  const nextData = { ...data, users: [ownerUser] };
  await updateData(nextData);

  return { data: nextData, users: [ownerUser] };
}

function ensureAtLeastOneActiveOwner(users: AdminUser[]) {
  const hasActiveOwner = users.some((user) => user.isOwner && user.isActive);

  if (!hasActiveOwner) {
    throw new PermissionError('At least one active owner account is required.', 400);
  }
}

function sortUsers(users: AdminUser[]) {
  return [...users].sort((left, right) => {
    if (left.isOwner !== right.isOwner) {
      return left.isOwner ? -1 : 1;
    }

    return left.name.localeCompare(right.name);
  });
}

export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/',
  });
}

export async function getCurrentAdminUser(): Promise<AdminUserProfile | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const session = readSessionToken(token);

  if (!session) {
    return null;
  }

  const { users } = await ensureUserStore();
  const user = users.find((candidate) => candidate.id === session.userId && candidate.isActive);

  if (!user) {
    return null;
  }

  return sanitizeUser(user);
}

export async function assertAdminPermission(permission: AdminPermission) {
  const user = await getCurrentAdminUser();

  if (!user) {
    throw new AuthError('You need to log in to continue.');
  }

  if (!hasAdminPermission(user, permission)) {
    throw new PermissionError('You do not have permission to perform this action.');
  }

  return user;
}

export async function requireAdminPagePermission(permission: AdminPermission) {
  const user = await getCurrentAdminUser();

  if (!user) {
    redirect('/admin/login');
  }

  if (!hasAdminPermission(user, permission)) {
    redirect('/admin');
  }

  return user;
}

export async function loginAdminUser(username: string, password: string) {
  const normalizedUsername = normalizeUsername(username || '');
  const candidatePassword = String(password || '');

  if (!normalizedUsername || !candidatePassword) {
    throw new AuthError('Username and password are required.', 400);
  }

  const { data, users } = await ensureUserStore();
  const matchedUser = users.find((user) => user.username === normalizedUsername && user.isActive);

  if (!matchedUser || !(await verifyPassword(candidatePassword, matchedUser.passwordHash))) {
    throw new AuthError('Invalid username or password.');
  }

  const now = new Date().toISOString();
  const updatedUsers = users.map((user) => user.id === matchedUser.id
    ? { ...user, lastLoginAt: now, updatedAt: now }
    : user);

  await updateData({ ...data, users: updatedUsers });

  const safeUser = sanitizeUser(updatedUsers.find((user) => user.id === matchedUser.id) || matchedUser);

  return {
    user: safeUser,
    token: createSessionToken(matchedUser.id),
  };
}

export async function listAdminUsers() {
  const { users } = await ensureUserStore();
  return sortUsers(users).map(sanitizeUser);
}

export async function saveAdminUserAccount(input: AdminUserInput) {
  const currentUser = await assertAdminPermission('users');
  const { data, users } = await ensureUserStore();
  const now = new Date().toISOString();
  const username = normalizeUsername(input.username || '');
  const name = input.name.trim();

  if (!name) {
    throw new AuthError('Name is required.', 400);
  }

  if (!username || username.length < 3) {
    throw new AuthError('Username must be at least 3 characters long.', 400);
  }

  const duplicateUser = users.find((user) => user.username === username && user.id !== input.id);

  if (duplicateUser) {
    throw new AuthError('That username is already in use.', 400);
  }

  const isOwner = Boolean(input.isOwner);
  const permissions = isOwner ? [...ADMIN_PERMISSIONS] : normalizeAdminPermissions(input.permissions || []);
  let nextUsers = [...users];
  let savedUser: AdminUser | undefined;

  if (input.id) {
    const existingUser = users.find((user) => user.id === input.id);

    if (!existingUser) {
      throw new AuthError('User not found.', 404);
    }

    if (existingUser.id === currentUser.id && !input.isActive) {
      throw new PermissionError('You cannot deactivate your own account.', 400);
    }

    savedUser = {
      ...existingUser,
      name,
      username,
      permissions,
      isActive: input.isActive,
      isOwner,
      updatedAt: now,
    };

    if (input.password?.trim()) {
      savedUser.passwordHash = await hashPassword(validatePassword(input.password));
    }

    nextUsers = users.map((user) => user.id === existingUser.id ? savedUser as AdminUser : user);
  } else {
    savedUser = {
      id: randomUUID(),
      name,
      username,
      passwordHash: await hashPassword(validatePassword(input.password || '')),
      permissions,
      isActive: input.isActive,
      isOwner,
      createdAt: now,
      updatedAt: now,
    };

    nextUsers = [...users, savedUser];
  }

  ensureAtLeastOneActiveOwner(nextUsers);
  await updateData({ ...data, users: sortUsers(nextUsers) });

  return sanitizeUser(savedUser);
}

export async function deleteAdminUserAccount(userId: string) {
  const currentUser = await assertAdminPermission('users');
  const { data, users } = await ensureUserStore();
  const targetUser = users.find((user) => user.id === userId);

  if (!targetUser) {
    throw new AuthError('User not found.', 404);
  }

  if (targetUser.id === currentUser.id) {
    throw new PermissionError('You cannot delete your own account.', 400);
  }

  const nextUsers = users.filter((user) => user.id !== userId);
  ensureAtLeastOneActiveOwner(nextUsers);

  await updateData({ ...data, users: sortUsers(nextUsers) });
}
