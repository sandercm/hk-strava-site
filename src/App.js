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
    const [runnerMap, setRunnerMap] = useState([]);
    const [homesWithRunners, setHomesWithRunners] = useState([]);
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
        // GET request using fetch inside useEffect React hook
        fetch('https://hk-strava.herokuapp.com/runners/name')
            .then(response => response.json())
            .then(data => {setRunnerMap(data)})
    }, []);

    useEffect(() => {
        const homesWithRunners = {
            'Home Vermeylen': [],
            'Home Astrid': [],
            'Home Boudewijn': [],
            'Home Bertha': [],
            'Home Fabiola': [],
            'Home Mercator': [],
            'Home Confabula': [],
            'Savania': []
        }
        if(runners.length !== 0 || runnerMap.length !== 0){
            runners.forEach(runner => {
                const name = (runner.athlete_firstname + ' ' + runner.athlete_lastname).toLowerCase()
                if(runnerMap[name]){
                    if(runnerMap[name]){
                        homesWithRunners[runnerMap[name]].push(runner);
                    }
                }
            })
            setHomesWithRunners(homesWithRunners);
        }
    },[runners, runnerMap])

    useEffect(() => {
        setTotals(getTotals())
    },[runners, homesWithRunners])

    const homeRunners = (value) => {
        if(homesWithRunners[value]){
            return homesWithRunners[value].slice(0,10);
        }
        return [];
    }

    function getTotal(value) {
        if(homeRunners(value).length > 0){
            return (parseFloat(numeral(homeRunners(value).map((value) => {
                return value.distance
            }).reduce((acc,x) => {
                return acc + x;
            })).format('0.0'))/1000).toFixed(2) + 'km'
        }else{
            return 0;
        }
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

    function printCol(begin, end){
        return (
            <Row className={'pt-3'}>
            {homes.slice(begin,end).map(((value, index) => {
                return (
                    <Col className={'p-2'}>
                        <Card>
                            <Card.Body>
                                <Card.Title>{value}</Card.Title>
                                <Card.Text>
                                    <h6>Beste 10 lopers</h6>
                                    <ol>
                                        {homeRunners(value, index+begin).map(((value) => {
                                            console.log(value);
                                            return <li id={value.id}>
                                                <Row>
                                                    <Col className={'col-8'}>{value.athlete_firstname +
                                                    ' ' +
                                                    value.athlete_lastname
                                                    }</Col>
                                                    <Col className={'col-4'}>
                                                        {numeral(value.distance).format('0.0 a') + 'm'}
                                                    </Col>
                                                </Row>

                                            </li>
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
              <Col className={'col-8'}>
                  {printCol(0,2)}
                  {printCol(2,4)}
                  {printCol(4,6)}
                  {printCol(6,8)}
              </Col>
              <Col className={'mt-4 col-4'}>
                  <div>{totals.map(((value) => {
                      return (<div className={'background:brown'}>
                          <h6 className={'progress-text'}>
                              {value.home + ':  ' + value.distance}
                          </h6>
                          <ProgressBar
                              animated
                              className={'m-1'}
                              now={(numeral(value.distance)._value/numeral(totals[0].distance)._value)*100}
                          />
                      </div>)
                  }))}</div>
              </Col>
          </Row>
      </Container>
  );
}

export default App;
