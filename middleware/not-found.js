//处理不存在的路由的情况
const notFoundMiddleware = (req, res) =>
  res.status(404).send('Route does not exist')

export default notFoundMiddleware

