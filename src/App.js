import './App.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import React, {useEffect, useState} from "react";
import Card from "react-bootstrap/Card";
import * as numeral from 'numeral'
import ProgressBar from "react-bootstrap/ProgressBar";
import {Alert} from "react-bootstrap";

function App() {
    let correction_tom = 0;
    let correction_hanne = 0;
    let correction_pieter = 0;
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
        'Home Mercator',
        'Home Confabula',
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
            if(homesWithRunners['Home Confabula'].filter(e => e.athlete_id === 6487075)){
                homesWithRunners['Home Confabula'].forEach(runner => {
                    if(runner.athlete_id === 6487075 && correction_tom < 1){
                        runner.distance -= 25150;
                        correction_tom += 1;
                        homesWithRunners['Home Confabula'].sort(compare);
                    }
                })
            }
            if(homesWithRunners['Home Confabula'].filter(e => e.athlete_id === 83153582)){
                homesWithRunners['Home Confabula'].forEach(runner => {
                    if(runner.athlete_id === 83153582 && correction_hanne < 1){
                        runner.distance = 45000;
                        correction_hanne += 1;
                        homesWithRunners['Home Confabula'].sort(compare);
                    }
                })
            }
            if(homesWithRunners['Home Confabula'].filter(e => e.athlete_id === 55297387)){
                homesWithRunners['Home Confabula'].forEach(runner => {
                    if(runner.athlete_id === 55297387 && correction_pieter < 1){
                        runner.distance -= 5000;
                        correction_pieter += 1;
                        homesWithRunners['Home Confabula'].sort(compare);
                    }
                })
            }
            if(homesWithRunners['Home Boudewijn'].filter(e => e.athlete_id === 79737984)){
                homesWithRunners['Home Boudewijn'].forEach(runner => {
                    if(runner.athlete_id === 79737984){
                        runner.distance = 0;
                        homesWithRunners['Home Boudewijn'].sort(compare);
                    }
                })
            }
            setHomesWithRunners(homesWithRunners);

            console.log(homesWithRunners);
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
                  <b>Home Konvent run 2021</b>
              </Navbar.Brand>
          </Navbar>
          <Row>
              <Col className={'col-4'}/>
              <Col className={'col-4 m-2'}><Alert className={'alert-warning'}>Disclaimer: Enkel de top 100 lopers staat op deze pagina. Dus het weergegeven resultaat kan variëren van het effectieve resultaat. Strava updatet de leaderboard ook maar om de 4 uur, dus er kan vertraging zijn.</Alert></Col>
              <Col className={'col-4'}/>
          </Row>
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
function compare( a, b ) {
    if ( a.distance < b.distance ){
        return 1;
    }
    if ( a.distance > b.distance ){
        return -1;
    }
    return 0;
}

export default App;
