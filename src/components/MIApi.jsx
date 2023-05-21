import React, { useEffect } from 'react'
import { useState } from 'react'
import { Table } from 'react-bootstrap'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const MIApi = () => {
// Estados
const [indicadores, setIndicadores] = useState([])
const [periodo, setPeriodo] = useState('2023')
const [filtro, setFiltro] = useState([])

// Hook de efecto
useEffect(() => {
    getIndicadores()
    console.log(indicadores)
}, [periodo]);

// Obtiene datos de la api
const getIndicadores = async () => {
    try {
        console.log(`El periodo seleccionado es ${periodo}`)
        const url = `https://mindicador.cl/api/dolar/${periodo}`
        const response = await fetch(url)
        const data = await response.json()
        setIndicadores(data)
    } catch (error) {
        console.log(error)
        setIndicadores([])
    }
}

const indicadoresFiltrados = indicadores.serie ? indicadores.serie.filter((indicador) => {
    const fecha = new Date(indicador.fecha)
    const fechaFormateada = fecha.toLocaleDateString()
    return fechaFormateada.includes(filtro)
}) : []


// Maneja el formulario
const handleForm = (e) => {
    e.preventDefault()
    setPeriodo(e.target.periodo.value)
}

const handleFiltro = (e) => {
    e.preventDefault()
    setFiltro(e.target.value)
}

  return (
    <div>
        {/* Formulario */}
        <Form onSubmit={handleForm}>

            {/* Renderiza periodos */}
            <Form.Select name="periodo">
                {(() => {
                    const options = [];
                    const currentYear = new Date().getFullYear();

                    for (let year = currentYear; year >= 1984; year--) {
                    options.push(<option value={year}>{year}</option>);
                    }

                    return options;

                    })()}
            </Form.Select>
            <Button variant="dark" as="input" type="submit" value="Enviar" />
        </Form>

        {/* Filtro */}
        <Form.Control type="text" placeholder="Filtrar por fecha" name="filtro" onChange={handleFiltro} />

        {/* Tabla */}
        <Table stripped bordered hover variant='dark'>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
                {indicadoresFiltrados.map((indicador, index) => {
                            const fecha = new Date(indicador.fecha)
                            const fechaFormateada = fecha.toLocaleDateString()

                            return (
                                <tr key={index}>
                        <td>{fechaFormateada}</td>
                        <td>{indicador.valor}</td>
                    </tr>
                )})}
            </tbody>
        </Table>
    </div>
  )
}

export default MIApi