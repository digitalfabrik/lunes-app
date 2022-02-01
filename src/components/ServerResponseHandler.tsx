import React, { ReactElement, ReactNode } from 'react'

import ErrorMessage from './ErrorMessage'
import Loading from './Loading'

interface ServerResponseHandlerPropsType {
  error: Error | null
  loading: boolean
  refresh: () => void
  children: ReactNode
}

const ServerResponseHandler = ({ loading, error, refresh, children }: ServerResponseHandlerPropsType): ReactElement => (
  <Loading isLoading={loading}>
    <ErrorMessage error={error} refresh={refresh} />
    {children}
  </Loading>
)

export default ServerResponseHandler
