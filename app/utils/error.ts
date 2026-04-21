export const handleError = (error: any) => {
  return error?.data?.message || 'Something went wrong'
}