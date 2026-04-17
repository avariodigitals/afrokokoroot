interface StorageStatus {
  environment: string
  usesBlobStorage: boolean
  hasPersistentStorage: boolean
  warning: string | null
}

interface AdminStorageNoticeProps {
  status: StorageStatus
}

export default function AdminStorageNotice({ status }: AdminStorageNoticeProps) {
  if (status.warning) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">Storage setup required</p>
        <p className="mt-1">{status.warning}</p>
      </div>
    )
  }

  if (!status.usesBlobStorage) {
    return (
      <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
        <p className="font-semibold">Local development storage</p>
        <p className="mt-1">Uploads and content edits are currently being saved to the local filesystem.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
      <p className="font-semibold">Persistent storage active</p>
      <p className="mt-1">Uploads and CMS edits are being stored in Vercel Blob.</p>
    </div>
  )
}