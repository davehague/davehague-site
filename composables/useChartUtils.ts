export const getStartDate = (selectedPeriod: string) => {
  const now = new Date()
  switch (selectedPeriod) {
    case '7':
      return new Date(now.setDate(now.getDate() - 7))
    case '30':
      return new Date(now.setDate(now.getDate() - 30))
    case '60':
      return new Date(now.setDate(now.getDate() - 60))
    case '90':
      return new Date(now.setDate(now.getDate() - 90))
    case 'ytd':
      return new Date(now.getFullYear(), 0, 1)
    default:
      return new Date(now.setDate(now.getDate() - 30))
  }
}

export const timePeriods = [
  { label: '7 days', value: '7' },
  { label: '30 days', value: '30' },
  { label: '60 days', value: '60' },
  { label: '90 days', value: '90' },
  { label: 'YTD', value: 'ytd' },
]