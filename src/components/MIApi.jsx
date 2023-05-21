import React, { useEffect } from 'react'
import { useState } from 'react'
import { Table } from 'react-bootstrap'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const MIApi = () => {
// Estados
const [indicadores, setIndicadores] = useState([])
const [periodo, setPeriodo] = useState('2023')
const [filtroFecha, setFiltroFecha] = useState([])
const [filtroValor, setFiltroValor] = useState([])
const [ordenColumna, setOrdenColumna] = useState(null)
const [ordenAscendente, setOrdenAscendente] = useState(true)

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
    return fechaFormateada.includes(filtroFecha) && indicador.valor.toString().includes(filtroValor)
}) : []


// Maneja el formulario
const handleForm = (e) => {
    e.preventDefault()
    setPeriodo(e.target.periodo.value)
    setOrdenColumna(null)
    setOrdenAscendente(true)
}

const handleFiltroFecha = (e) => {
    e.preventDefault()
    setFiltroFecha(e.target.value)
}

const handleFiltroValor = (e) => {
    e.preventDefault()
    setFiltroValor(e.target.value)
}

const ordenarColumna = (columna) => {
    if (columna === ordenColumna) {
        // Si la columna ya está ordenada, cambia el estado de ordenAscendente
        setOrdenAscendente(!ordenAscendente)
    } else {
        // Si se está ordenando por una columna distinta, se ordena de forma ascendente
        setOrdenColumna(columna)
        setOrdenAscendente(true)
    }
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

        {/* FiltroFecha */}
        <Form.Control type="text" placeholder="Filtrar por fecha" name="filtroFecha" onChange={handleFiltroFecha} />

        {/* FiltroValor */}
        <Form.Control type="text" placeholder="Filtrar por valor" name="filtroValor" onChange={handleFiltroValor} />

        {/* Tabla */}
        <Table stripped bordered hover variant='dark'>
            <thead>
                <tr>
                    <th><button
                     className='btn btn-link'
                     onClick={()=> ordenarColumna("fecha")}>Fecha</button></th>
                    <th><button
                     className='btn btn-link'
                     onClick={()=> ordenarColumna("valor")}>Valor</button></th>
                </tr>
            </thead>
            <tbody>
                {indicadoresFiltrados
                .sort((a, b) => {
                    if (ordenColumna === "fecha") {
                        return ordenAscendente
                        ? new Date(a.fecha) - new Date(b.fecha)
                        : new Date(b.fecha) - new Date(a.fecha)
                    } else if (ordenColumna === "valor") {
                        return ordenAscendente
                        ? a.valor - b.valor
                        : b.valor - a.valor
                    }
                    return 0
                })
                .map((indicador, index) => {
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