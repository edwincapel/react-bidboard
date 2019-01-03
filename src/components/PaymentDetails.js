// import React from 'react';
// import { Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Label } from 'reactstrap'
// import DropIn from "braintree-web-drop-in-react";
// import axios from 'axios'


// export default class PaymentDetails extends React.Component {
//   instance;

//   state = {
//     modal: false,
//     clientToken: null
//   };

//   generate_client_token = () => {
//     axios({
//       method: 'get',
//       url: 'http://127.0.0.1:5000/api/v1/bids/new_token',

//     })
//       .then(response => {
//         console.log(response)
//         this.setState({
//           clientToken: response.data
//         })
//       })
//       .catch(error => {
//         console.log(error);
//       })
//   };

//   toggle = () => {
//     this.setState({
//       modal: !this.state.modal
//     });

//   }
//   componentDidMount = () => {
//     this.generate_client_token()
//   }

//   render() {


//   }
