
import React from 'react';
import { Container, Col, Form, Navbar, Nav, Row, FormControl, Button } from 'react-bootstrap';
import _ from 'underscore';
import Authenticate from '../Authenticate.js';
import ListTrain from "./ListTrain";


class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        const input_fields = {
            train_name : '',
            train_number : '',
            from_station : '',
            to_station : '',
            ticket_price : '',
        };
        this.state = {
            ...input_fields,
            train_id : "",
            err_msg : {
                is_error : false,
                ...input_fields
            },
            data_added : false,
        };
    }

    getChangedValue = (event) => {
        const { id, value , data_added} = event.target;
        const {err_msg} = this.state;

        if(err_msg[id])
            err_msg[id] = "";

        this.setState({
            [id] : value,
            err_msg
        });
    }


    resetForm = (reset_all = false) => {
        const input_fields = this.state;

        if(reset_all) {
            Object.keys(input_fields.err_msg).map((key) => {
                input_fields.err_msg[key] = (key !== 'is_error') ? '' : false;
            });
        }
        Object.keys(input_fields).map((key) => {
            if(key !== 'err_msg') {
                input_fields[key] = (key !== 'data_added') ? '' : false;
            }
        });
        this.setState({
            input_fields
        });
    }

    async componentDidMount() {
        // this.getTrains();
    }


    submitTrainData = () => {
        const input_fields = this.state;
        const phone_reg =  /^\d+$/;

        Object.keys(input_fields.err_msg).map((key) => {
            input_fields.err_msg[key] = (key !== 'is_error') ? '' : false;
        });

        Object.keys(input_fields).map((key) => {
            if(key !== 'err_msg' && key !== 'train_data' && key !== 'data_added' && key !== 'train_id') {
                if(!input_fields[key]) {
                    input_fields.err_msg[key] = "Please enter " +(key).replace(/_/g, " ");
                    input_fields.err_msg.is_error = true;
                } else {
                    if((key === 'train_number' || key === 'ticket_price') && phone_reg.test(input_fields[key]) === false) {
                        input_fields.err_msg[key] = "Please enter valid train number";
                        input_fields.err_msg.is_error = true;
                    }
                }
            }
        });
        console.log('input_fields :>> ', input_fields);
        
        this.setState({
            ...input_fields
        });

        if(input_fields.err_msg.is_error === false)
            this.addTrain();
    }


    addTrain = async () => {
        const { train_name, train_number, train_id, from_station, to_station, ticket_price } = this.state;
        Authenticate.requestAPI({
                train_id : train_id || 0,
                train_name,
                train_number,
                from_station,
                to_station,
                ticket_price,
            }, "trains/save", (err) => {
            if(err) return console.log('err :>> ', err);
            this.setState({
                data_added : true
            })
            this.resetForm();
        });
    }
    
    editTrain = (obj) => {
        this.setState({
            train_id : obj.train_id,
            train_name : obj.train_name,
            train_number : obj.train_number,
            from_station : obj.from_station,
            to_station : obj.to_station,
            ticket_price : obj.ticket_price
        });
    }

    deleteTrain = (obj) => {
        Authenticate.requestAPI({
            _id : obj._id || 0,
        }, "trains/delete", (err) => {
            if(err) return console.log('err :>> ', err);
            this.setState({
                data_added : true
            })
            this.resetForm();
        });
    }
    
    render() {
        const token = Authenticate.loggedIn();
        if(token)
            return window.location.href = "/login";

        const is_admin = Authenticate.isAdmin();
        
        if(is_admin === 0)
            return window.location.href = "/dashboard";

        const input_fields = this.state;

        return (
            <Container className="dashboard">
                <Navbar className="bg-light justify-content-between">
                    <Navbar.Brand href="#home" className="text-capitalize">Hi, {Authenticate.getUsername()}</Navbar.Brand>
                    <Nav>
                        <Nav.Link onClick={Authenticate.logout}>Logout</Nav.Link>
                    </Nav>
                </Navbar>
                <Row>
                <Col md={{ span: 2 }}>
                        <FormControl 
                            type="text"
                            placeholder="Train Name"
                            id="train_name"
                            value={input_fields.train_name}
                            onChange={this.getChangedValue}
                        />
                        {input_fields.err_msg.train_name &&
                            <Form.Text className="text-error">{input_fields.err_msg.train_name}</Form.Text>
                        }
                    </Col>
                    <Col md={{ span: 2 }}>
                        <FormControl 
                            type="text"
                            placeholder="Train Number"
                            id="train_number"
                            value={input_fields.train_number}
                            onChange={this.getChangedValue}
                        />
                        {input_fields.err_msg.train_number &&
                            <Form.Text className="text-error">{input_fields.err_msg.train_number}</Form.Text>
                        }
                    </Col>
                    <Col md={{ span: 2 }}>
                        <FormControl 
                            type="text"
                            placeholder="from station"
                            id="from_station"
                            value={input_fields.from_station}
                            onChange={this.getChangedValue}
                        />
                        {input_fields.err_msg.from_station &&
                            <Form.Text className="text-error">{input_fields.err_msg.from_station}</Form.Text>
                        }
                    </Col>
                    <Col md={{ span: 2 }}>
                        <FormControl 
                            type="text"
                            placeholder="to station"
                            id="to_station"
                            value={input_fields.to_station}
                            onChange={this.getChangedValue}
                        />
                        {input_fields.err_msg.to_station &&
                            <Form.Text className="text-error">{input_fields.err_msg.to_station}</Form.Text>
                        }
                    </Col>
                    <Col md={{ span: 2 }}>
                        <FormControl 
                            type="text"
                            placeholder="Price"
                            id="ticket_price"
                            value={input_fields.ticket_price}
                            onChange={this.getChangedValue}
                        />
                        {input_fields.err_msg.ticket_price &&
                            <Form.Text className="text-error">{input_fields.err_msg.ticket_price}</Form.Text>
                        }
                    </Col>
                    <Col md={{ span: 2 }}>
                        <Button className="float-right" onClick={this.submitTrainData}>Save</Button>
                    </Col>
                </Row>
                <ListTrain dataAdded={this.state.data_added} editTrain={this.editTrain} deleteTrain={this.deleteTrain} />
            </Container>
        );
    }
}

export default Dashboard;
