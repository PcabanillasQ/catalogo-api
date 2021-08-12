const express = require('express')
const cors = require('cors')
const app = express()
const logger = require('./loggerMiddleware')
const catalogo = require('./data')

app.use(cors())
app.use(express.json())
app.use(logger)

let { productos } = catalogo

app.get('/', (request, response) => {
  response.send('<h1>HolaMundo</h1>')
})


app.get('/api/productos', (request, response) => {
  response.json(productos)
})

app.get('/api/productos/:id', (request, response) => {
  const { id } = request.params
  const producto = productos.find((prod) => prod.id === Number(id))
  if (producto) {
    response.json(producto)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/productos/:id', (request, response) => {
  const { id } = request.params
  productos = productos.filter((prod) => prod.id !== Number(id))
  response.status(204).end()
})

app.post('/api/productos', (request, response) => {
  const producto = request.body

  if (!producto || !producto.name) {
    return response.status(400).json({ error: 'product is missing' })
  }

  const ids = productos.map((prod) => prod.id)
  const maxID = Math.max(...ids)
  const newProducto = {
    id: maxID + 1,
    code: producto.code,
    creation_date: new Date().toISOString(),
    name: producto.name,
    brand: producto.brand,
    slug: producto.slug,
    colors: producto.colors,
    voltage: producto.voltage,
    power: producto.power,
    description: producto.description,
    dimensions: producto.dimensions,
    list_price: producto.list_price,
    images: {
      original: producto.images.original,
    },
  }

  productos = [...productos, newProducto]
  response.status(201).json(newProducto)
  console.log(newProducto)
  // response.end();
})

const PORT = process.env.PORT || 3001
app.listen(PORT, (err) => {
  if (err) console.log(err)
  console.log(`Server ejecutandose en el puerto ${PORT}`)
})
