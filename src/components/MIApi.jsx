import React, { useEffect } from 'react'
import { useState } from 'react'
import { Table } from 'react-bootstrap'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const MIApi = () => {
const [indicadores, setIndicadores] = useState([])
const [periodo, setPeriodo] = useState('2023')

useEffect(() => {
    getIndicadores()
    console.log(indicadores)
}, [periodo]);

const getIndicadores = async () => {
    try {
        console.log(`El periodo seleccionado es ${periodo}`)
        const url = `https://mindicador.cl/api/dolar/${periodo}`
        const response = await fetch(url)
        const data = await response.json()
        setIndicadores(data)
    } catch (error) {
        console.log(error)
    }
}

const handleForm = (e) => {
    e.preventDefault()
    setPeriodo(e.target.periodo.value)
}

  return (
    <div>
        <Form onSubmit={handleForm}>
            <Form.Select name="periodo">
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
            </Form.Select>
            <Button variant="dark" as="input" type="submit" value="Enviar" />
        </Form>

        <Table stripped bordered hover variant='dark'>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
                {indicadores.serie &&
                        indicadores.serie.map((indicador, index) => {
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