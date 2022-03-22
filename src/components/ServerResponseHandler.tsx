import React, { ReactElement, ReactNode } from 'react'

import ErrorMessage from './ErrorMessage'
import Loading from './Loading'

interface ServerResponseHandlerProps {
  error: Error | null
  loading: boolean
  refresh: () => void
  children: ReactNode
}

const ServerResponseHandler = ({ loading, error, refresh, children }: ServerResponseHandlerProps): ReactElement => (
  <Loading isLoading={loading}>
    {children}
    <ErrorMessage error={error} refresh={refresh} />
  </Loading>
)

export default ServerResponseHandler
