import React, { ReactElement, ReactNode } from 'react'

import ErrorMessage from './ErrorMessage'
import Loading from './Loading'

interface ServerResponseHandlerProps {
  error: Error | null
  loading: boolean
  refresh: () => void
  children: ReactNode
}

const ServerResponseHandler = ({ loading, error, refresh, children }: ServerResponseHandlerProps): ReactElement => {
  return (
    <Loading isLoading={loading}>
      <ErrorMessage error={error} refresh={refresh} />
      {children}
    </Loading>
  )
}

export default ServerResponseHandler
