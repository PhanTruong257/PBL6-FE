import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'

export default {
  name: 'Tanstack Query',
  render: <ReactQueryDevtoolsPanel />,
}

// Comment out devtools in production
// You can enable it back by uncommenting the export above
// export default null
