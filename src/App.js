import logo from './logo.svg';
import './App.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import React, {useEffect, useState} from "react";
import Card from "react-bootstrap/Card";
import * as numeral from 'numeral'

function App() {
    const [runners, setRunners] = useState([]);
    const homes = [
        'Home Vermeylen',
        'Home Astrid',
        'Home Boudewijn',
        'Home Bertha',
        'Home Fabiola',
        'Mercator',
        'Confabula',
        'Savania']

    useEffect(() => {
        // GET request using fetch inside useEffect React hook
        fetch('https://hk-strava.herokuapp.com/runners')
            .then(response => response.json())
            .then(data => setRunners(data.data))
    }, []);

    const homeRunners = (value, index) => {
        return runners.slice(index*5,index*5+5);
    }

    function getTotal(value, index) {
        console.log('calling get total')
        console.log(homeRunners(value, index))
        if(homeRunners(value, index).length > 0){
            return numeral(homeRunners(value, index).map((value, index) => {
                return value.distance
            }).reduce((acc,x) => {
                return acc + x;
            })).format('0.0 a') + 'm'
        }else{
            return 0;
        }
    }

    return (
      <Container fluid="md">
          <Navbar bg="dark" variant="dark" className={'bg-custom-2'}>
              <Navbar.Brand className={'dark-text'}>
                  <img
                      alt=""
                      src="/konvent.png"
                      width="25"
                      height="30"
                      className="d-inline-block align-top"
                  />{' '}
                  <b>Home Konvent run 2020</b>
              </Navbar.Brand>
          </Navbar>
        <Row className={'pt-3'}>
            {homes.slice(0,4).map(((value, index) => {
                return (
                <Col className={'p-2'}>
                    <Card>
                        <Card.Body>
                            <Card.Title>{value}</Card.Title>
                            <Card.Text>
                                <h6>Beste 5 lopers</h6>
                                <ol>
                                    {homeRunners(value, index).map(((value, index) => {
                                        return <li>{value.athlete_firstname +
                                        ' ' +
                                        value.athlete_lastname +
                                        '   :  ' +
                                        numeral(value.distance).format('0.0 a') + 'm'}</li>
                                            }))}
                                </ol>
                                <h6>totaal: {getTotal(value, index)}</h6>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                )
            }))}
        </Row>
        <Row>
            {homes.slice(4,8).map(((value, index) => {
                return (
                    <Col className={'p-2'}>
                        <Card>
                            <Card.Body>
                                <Card.Title>{value}</Card.Title>
                                <Card.Text>
                                    <h6>Beste 5 lopers</h6>
                                    <ol>
                                        {homeRunners(value, index+4).map(((value, index) => {
                                            return <li>{value.athlete_firstname +
                                            ' ' +
                                            value.athlete_lastname +
                                            '   :  ' +
                                            numeral(value.distance).format('0.0 a') + 'm'}</li>
                                        }))}
                                    </ol>
                                    <h6>totaal: {getTotal(value, index+4)}</h6>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                )
            }))}
        </Row>
      </Container>
  );
}

export default App;
