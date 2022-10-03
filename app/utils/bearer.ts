export const getToken = (str: string) => {
  const splited = str.split(' ')

  return splited[0] === 'Bearer' ? splited[1] : null
}
