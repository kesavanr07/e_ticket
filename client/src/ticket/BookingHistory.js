import React, {Component} from 'react'
import { Button, Table } from 'react-bootstrap';
import Authenticate from '../Authenticate.js';


class BookingHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            all_tickets : [],
            err_msg : "",
        }
    }

    getBookedTickets = async () => {
        var {all_tickets, err_msg} = this.state;
        Authenticate.requestAPI({}, "tickets/get", (err, response) => {
            if(err) {
                err_msg = err;
            } else {
                all_tickets = (response && response.all_tickets) || [];

                const all_trains = this.props.allTrains || [];

                all_tickets.map((tickets) => {
                    all_trains.map((train) => {
                        if(train.train_id == tickets.train_id) {
                            tickets['train_name'] = train.train_name;
                            tickets['train_number'] = train.train_number;
                            tickets['from_station'] = train.from_station;
                            tickets['to_station'] = train.to_station;
                        }
                    });
                });
                console.log('all_tickets :>> ', all_tickets);
            }
            this.setState({
                all_tickets,
                err_msg
            });
        });
    }

    cancelTickets = async (ticket_id) => {
        var {err_msg} = this.state;
        Authenticate.requestAPI({
            ticket_id
        }, "tickets/cancel", (err, response) => {
            if(err) {
                err_msg = err;
            }
            console.log('response :>> ', response);
            this.setState({
                err_msg
            });
        });
    }

    componentWillReceiveProps(props) {
        if(props.dataAdded === true || props.allTrains) {
            this.getBookedTickets();
        }
    }
    
    render() {
        const {all_tickets} = this.state;
        return (

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Train Name</th>
                        <th>Train Number</th>
                        <th>Total Passangers</th>
                        <th>From Station</th>
                        <th>To Station</th>
                        <th>Ticket Price</th>
                        <th>Status</th>
                        <th>Cancel</th>
                    </tr>
                </thead>
                <tbody>
                    {all_tickets.map((obj, index) => (
                        <tr key={index}>
                            <td>{obj.train_name}</td>
                            <td>{obj.train_number}</td>
                            <td>{obj.passengers.length}</td>
                            <td>{obj.from_station}</td>
                            <td>{obj.to_station}</td>
                            <td>{obj.ticket_price}</td>
                            <td className="text-uppercase">{obj.status}</td>
                            <td>
                                {obj.status == 'booked' &&
                                    <Button variant="outline-danger" onClick={(e) => this.cancelTickets(obj.ticket_id)}> x </Button>
                                }
                            </td>
                        </tr>      
                    ))}
                    {all_tickets.length === 0 &&
                        <tr>
                            <td colSpan="8" className="text-center">No Train data found</td>
                        </tr>
                    }
                </tbody>
            </Table>
        )
    }
}

export default BookingHistory;