import './App.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import React, {useEffect, useState} from "react";
import Card from "react-bootstrap/Card";
import * as numeral from 'numeral'
import ProgressBar from "react-bootstrap/ProgressBar";

function App() {
    const [runners, setRunners] = useState([]);
    const [totals, setTotals] = useState([]);
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
            .then(data => setRunners(data.data));
    }, []);

    useEffect(() => {
        console.log('runners changed, setting totals')
        setTotals(getTotals())
    },[runners])

    // useEffect(() => {
    //     setTotals(getTotals())
    // },runners)

    const homeRunners = (value, index) => {
        return runners.slice(index*5,index*5+5);
    }

    function getTotal(value, index) {
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


    function printTotals() {
        return function () {
            console.log(homes);
            const ranking = homes.map((value, index) => {
                return {home: value, distance: getTotal(value,index)}
            })
            console.log(ranking.sort((a,b) =>
                numeral(b.distance)._value - numeral(a.distance)._value))
        };
    }

    function getTotals() {
        return function () {
            const ranking = homes.map((value, index) => {
                return {home: value, distance: getTotal(value,index)}
            })
            return ranking.sort((a,b) =>
                numeral(b.distance)._value - numeral(a.distance)._value)
        };
    }

    function getBars(){
        return
    }

    function printCol(begin, end){
        return (        <Row className={'pt-3'}>
            {homes.slice(begin,end).map(((value, index) => {
                return (
                    <Col className={'p-2'}>
                        <Card>
                            <Card.Body>
                                <Card.Title>{value}</Card.Title>
                                <Card.Text>
                                    <h6>Beste 5 lopers</h6>
                                    <ol>
                                        {homeRunners(value, index+begin).map(((value, index) => {
                                            return <li>{value.athlete_firstname +
                                            ' ' +
                                            value.athlete_lastname +
                                            '   :  ' +
                                            numeral(value.distance).format('0.0 a') + 'm'}</li>
                                        }))}
                                    </ol>
                                    <h6>totaal: {getTotal(value, index+begin)}</h6>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                )
            }))}
        </Row>)
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
          <Row>
              <Col>
                  {printCol(0,2)}
                  {printCol(2,4)}
                  {printCol(4,6)}
                  {printCol(6,8)}
              </Col>
              <Col className={'mt-4'}>
                  <div>{totals.map(((value, index) => {
                      console.log(numeral(value.distance)._value)
                      return (<div className={'background:brown'}>
                          <h6>
                              {value.distance}
                          </h6>
                          <ProgressBar animated className={'m-1'}
                                       now={(numeral(value.distance)._value/numeral(totals[0].distance)._value)*100}
                                       label={value.home}
                          />
                      </div>)
                  }))}</div>
              </Col>
          </Row>


      </Container>
  );
}

export default App;
