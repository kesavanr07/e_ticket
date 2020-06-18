
import React from 'react';
import { Container, Col, Alert, Navbar, Nav, ListGroup, InputGroup, Row, FormControl, Button, Jumbotron } from 'react-bootstrap';
import _ from 'underscore';
import Authenticate from '../Authenticate.js';
import BookingHistory from './BookingHistory.js'
import "./Dashboard.css";


class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            all_trains   : [],
            err_msg: "",
            input_fields : [],
            selected_train: {},
            data_added : false
        }
    }

    getPassengerInput = () => {
        return {
            name : "",
            age : "",
            gender : "",
            discount : "",
            ticket_price : 0,
        }
    }
    
    closeAlert = () => {
        this.setState({
            err_msg : ""
        });
    }

    validatePassengers = () => {
        var {input_fields, selected_train, err_msg} = this.state;
        // var 
        err_msg = "";

        if(!selected_train || (selected_train && !selected_train.train_id)) {
            err_msg = "Please Select the train";
        } else {
            if(!input_fields || (input_fields && input_fields.length == 0)) {
                err_msg = "Please add passanger details";
            } else {
                input_fields.map((obj) => {
                    Object.keys(obj).map((key) => {
                        if(!obj[key] && key != 'discount') {
                            err_msg = "Please enter all passanger details";
                        }
                    })
                })
            }
        }
        this.setState({
            err_msg
        });
        return err_msg;
    }

    getAllTrains = () => {
        var {all_trains, err_msg} = this.state;
        Authenticate.requestAPI({}, "trains/get", (err, response) => {
            if(err) return err_msg = err;
            
            all_trains = (response && response.train_data) || [];

            this.setState({
                all_trains,
                err_msg
            });
        });
    }

    selectTrain = (event) => {
        var {all_trains} = this.state;
        const { value } = event.target;
        const selected_train = all_trains.filter((obj) => {
            return obj.train_id === parseInt(value);
        })
        this.setState({
            selected_train : (selected_train && selected_train[0]) || {},
            err_msg:""
        });
    }

    getChangedValue = (event, index) => {
        const { name, value } = event.target;
        const {input_fields, selected_train} = this.state;
        const ticket_price = parseFloat(selected_train && selected_train.ticket_price || 0);
        if(name === 'age' && ticket_price > 0) {
            const discount_amount = (parseInt(value) > 60) ? ticket_price * 0.2 : 0; 
            input_fields[index]['discount'] = parseFloat((discount_amount).toFixed(2) || 0.00);
            input_fields[index]['ticket_price'] = parseFloat((ticket_price - discount_amount).toFixed(2) || 0.00);
        }

        input_fields[index][name] = value;
        this.setState({
            input_fields,
            err_msg : ""
        });
    }

    addPassanger = () => {
        const {input_fields} = this.state;
        const new_input_fields = {...this.getPassengerInput()};
        
        input_fields.push(new_input_fields);

        this.setState({
            input_fields,
            err_msg : ""
        });
    }

    async componentDidMount() {
        this.getAllTrains(  );
    }

    removePassenger = (index) => {
        const {input_fields} = this.state;
        input_fields.splice(index, 1);

        this.setState({
            input_fields
        });
    }

    bookTicket = () => {
        if(this.validatePassengers() === "") {
           
            const { input_fields, selected_train } = this.state;
            Authenticate.requestAPI({
                train_id : selected_train && selected_train.train_id || 0,
                user_id : Authenticate.getUserId() || 0,
                passengers : input_fields
            }, "tickets/save", (err) => {
                if(err) {
                    this.setState({
                        err_msg : err
                    })
                } else {
                    this.setState({
                        data_added : true,
                        input_fields : [],
                        err_msg : ""
                    })
                }
            });
        }
    }

    render() {
        const token = Authenticate.loggedIn();
        if(token)
            return window.location.href = "/login";
        
        const { all_trains, input_fields, selected_train, err_msg,data_added } = this.state;
        return (
            <div>
            <Container className="dashboard">
                <Navbar className="bg-light justify-content-between">
                    <Navbar.Brand href="#home" className="text-capitalize">Hi, {Authenticate.getUsername()}</Navbar.Brand>
                    <Nav>
                        <Nav.Link onClick={Authenticate.logout}>Logout</Nav.Link>
                    </Nav>
                </Navbar>
                <Row>    
                    <br/>          
                    <Col>  
                        {err_msg !== "" &&
                            <Alert variant="danger" onClose={this.closeAlert} dismissible>{err_msg}</Alert>
                        }
                    </Col>
                </Row>                
                <h2>Book Your ticket</h2><br/>
                <Row>
                    <Col md={{span:2}}>
                        <FormControl as="select"
                            onChange={this.selectTrain}
                        >
                            <option>--Select Train--</option>
                        {all_trains.map((obj, index) => {
                            return (
                                <option key={index} value={obj.train_id}>{obj.train_name})</option>
                            )
                        })}
                        </FormControl>
                    </Col>
                    <Col>
                        <Row md={{span:12}}>
                            <Col>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon3">
                                        Form Station
                                    </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl 
                                        type="text"
                                        value={selected_train && selected_train.from_station || "-"}
                                        readOnly={true}
                                    />
                                </InputGroup>
                            </Col>
                            <Col>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon3">
                                        To Station
                                    </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl 
                                        type="text"
                                        value={selected_train && selected_train.to_station || "-"}
                                        readOnly={true}
                                    />
                                </InputGroup>
                            </Col>
                            <Col>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon3">
                                        Train No
                                    </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl 
                                        type="text"
                                        value={selected_train && selected_train.train_number || "-"}
                                        readOnly={true}
                                    />
                                </InputGroup>
                            </Col>
                            <Col>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon3">
                                        Price
                                    </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl 
                                        type="text"
                                        value={selected_train && selected_train.ticket_price || "-"}
                                        readOnly={true}
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <hr/>
                {selected_train && selected_train.ticket_price &&
                    <Row>
                        <Col md={{span:10}}>20% discount for the person age above 60 </Col>
                        <Col md={{span:2}}>
                                <Button className="float-right" onClick={this.addPassanger}>Add Passenger</Button>
                        </Col>
                    </Row>
                }
                    
                <Col md={{ span: 12 }}>
                    {input_fields.map((obj, index) => {
                        return (
                            <Row key={index}>
                                <FormControl 
                                    className="col-3"
                                    type="text"
                                    placeholder="Name"
                                    name="name"
                                    onChange={(e) => this.getChangedValue(e, index)}
                                />
                                <FormControl 
                                    className="col-3"
                                    type="number"
                                    placeholder="Age"
                                    name="age"
                                    maxLength="3"
                                    onChange={(e) => this.getChangedValue(e, index)}
                                />
                                <FormControl as="select"
                                    className="col-3"
                                    onChange={(e) => this.getChangedValue(e, index)}
                                    name="gender"
                                >
                                    <option value="">--Gender--</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </FormControl>
                                <FormControl 
                                    className="col-2"
                                    type="text"
                                    placeholder="Discount amount"
                                    name="discount"
                                    value={obj.discount}
                                    readOnly={true}
                                />
                                <Button variant="outline-danger" onClick={(e) => this.removePassenger(index)}> x </Button>
                            </Row>                                
                        )
                    })}
                </Col>
                <hr/>
                <Col md={{ span: 12}}>
                    <Button variant="outline-success" className="float-right" onClick={(e) => this.bookTicket()}> Book Ticket </Button>
                </Col>
            </Container>
            <Container><br/><br/>
                <h3 className="text-center">Booking history</h3><br/>
                <BookingHistory allTrains={all_trains} dataAdded={data_added}/>
            </Container>
        </div>
    );
    }
}

export default Dashboard;
