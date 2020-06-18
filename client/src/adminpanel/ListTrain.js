import React, {Component} from 'react'
import { Col, Table, Button } from 'react-bootstrap';
import Authenticate from '../Authenticate.js';


class ListTrain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            all_trains : [],
            lis_train_err : "",
        }
    }

    getTrains = async () => {
        var {all_trains, lis_train_err} = this.state;
        Authenticate.requestAPI({}, "trains/get", (err, response) => {
            if(err) return lis_train_err = err;
            
            all_trains = (response && response.train_data) || [];

            this.setState({
                all_trains,
                lis_train_err
            });
        });
    }

    componentDidMount() {
        this.getTrains();
    }
    
    componentWillReceiveProps(props) {
        if(props.dataAdded === true) {
            this.getTrains();
        }
    }
    
    render() {
        const {all_trains} = this.state;
        return (
            <Col>
            <hr/>
                <h3 className="text-center">All Train</h3><br/>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Train Name</th>
                            <th>Train Number</th>
                            <th>From Station</th>
                            <th>To Station</th>
                            <th>Ticket Price</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {all_trains.map((obj, index) => (
                            <tr key={index}>
                                <td>{obj.train_name}</td>
                                <td>{obj.train_number}</td>
                                <td>{obj.from_station}</td>
                                <td>{obj.to_station}</td>
                                <td>Rs.{obj.ticket_price}</td>
                                <td>
                                    <Button variant="outline-primary" onClick={(e) => this.props.editTrain(obj)}> Edit </Button>
                                    <Button variant="outline-danger" onClick={(e) => this.props.deleteTrain(obj)}> x </Button>
                                </td>
                            </tr>      
                        ))}
                        {all_trains.length === 0 &&
                            <tr>
                                <td colSpan="6" className="text-center">No Train data found</td>
                            </tr>
                        }
                    </tbody>
                </Table>
            </Col>
        )
    }
}

export default ListTrain;