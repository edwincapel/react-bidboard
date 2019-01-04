import React, { Component, Fragment } from 'react'
import Dropzone from 'react-dropzone'
import axios from 'axios'
import { Button, Form, FormGroup, Input, Table, Row, Col, Container } from 'reactstrap'
import Loader from '../images/loader.gif'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleUp } from '@fortawesome/free-solid-svg-icons'
import ProgressBar from './ProgressBar';
import { Link } from 'react-router-dom'

export default class DropFile extends Component {
    constructor() {
        super()
        this.state = {
            medium: null,
            generalConcepts: null,
            isLoading: false,
            success: false,
            description: "",
            campaign_name: "",
            file: [],
            imgSrc: null,
            fileName: "",
            fileSize: "",
            currentUser: JSON.parse(localStorage.getItem('currentUser')),
            illegal: '',
            nsfw: '',
            moderation: '',
            isApproved: null,
            concepts: null
        }
    }

    handleDescriptionChange = (e) => {
        this.setState({ description: e.target.value })
    }

    handleCampaignNameChange = (e) => {
        this.setState({ campaign_name: e.target.value })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.setState({
            isLoading: true
        })
        let formData = new FormData()
        formData.set('campaign_name', this.state.campaign_name)
        formData.set('description', this.state.description)
        formData.set('user_id', this.state.currentUser.id)
        formData.append('user_media', this.state.file[0])

        axios({
            method: 'post',
            url: 'http://127.0.0.1:5000/api/v1/media/upload',
            headers: {
                "Content-Type": 'multipart/form-data'
            },
            data: formData
        })
            .then(response => {
                console.log(response)
                // console.log(response.data.medium.concepts)
                if (response.status === 201) {
                    console.log("success");
                    this.setState({
                        isLoading: false,
                        success: true,
                        medium: response.data.medium,
                        generalConcepts: response.data.concepts.general,
                        illegal: response.data.concepts.illegal,
                        moderation: response.data.concepts.moderation,
                        nsfw: response.data.concepts[3],
                        isApproved: response.data.is_approved,
                        concepts: response.data.concepts
                    })
                }
                // console.log(response.data.medium.concepts.general);

            })
            .catch(error => {
                console.log(error);
            });
    }

    onDrop(file) {
        file.map(file => (
            this.setState({
                fileName: file.name,
                fileSize: (parseInt(file.size) / (Math.pow(1024, 2))).toFixed(2)
            })
        ))

        const reader = new FileReader()
        reader.addEventListener("load", () => {
            // console.log(reader.result);
            this.setState({
                file,
                imgSrc: reader.result
            })
        })
        reader.readAsDataURL(file[0])

    }

    onCancel = () => {
        this.setState({
            file: [],
            imgSrc: null,
            success: false
        });
    }



    render() {
        const { imgSrc, fileName, fileSize, success, isLoading, generalConcepts, medium, concepts, isApproved } = this.state
        if (this.state.file.length > 0 && success) {
            return (
                <div id="success-preview" className="w-100 h-100 p-5">
                    <Container className="w-100 h-100" fluid>
                        <Row className="h-100">
                            <Col md="3" className="h-100 p-0 shadow-me">

                                {/* {this.state.moderation.safe <= 0.4 ? 'The image you uploaded is suggestive of something illegal': ''} */}
                                {/* {this.state.nsfw.sfw <= 0.5 ? 'The image you uploaded is suggestive of something illegal': ''} */}
                                <div id='generalconceptdiv' className="h-100">
                                    {/* progress bar here  loop through general concepts object*/}
                                    {
                                        Object.entries(generalConcepts).map((item, i) => (
                                            <ProgressBar class='generalconcepts' key={i} item={item} />
                                        ))
                                    }
                                </div>
                            </Col>
                            <Col md="9" className="h-100 p-0">
                                {imgSrc !== null ? <img src={imgSrc} className="w-100 h-25 mb-3 border-bottom" alt="" /> : ''}
                                {isApproved
                                    ? <div className="p-3">
                                        <p>Your Ad has been <span className="text-success">approved</span></p>
                                        <h5>
                                            <Link to={'/bid'} className="">
                                                Start bidding now !
                                        </Link>
                                        </h5>
                                    </div>
                                    : <div className="p-3">
                                        <h4>Your Ad has been <span className="text-danger">rejected</span></h4>
                                        <h5>Reason:</h5>
                                        <p>{this.state.moderation.safe <= 0.4 ? 'The image you uploaded is suggestive of something illegal' : ''}</p>
                                        <h5>
                                            <Link to={'/new'} className="">
                                                New Ad
                                        </Link>
                                        </h5>
                                    </div>
                                }
                            </Col>
                        </Row>
                    </Container>
                </div>
            )
        }
        else if (this.state.file.length > 0 && success === false) {
            return (
                <Fragment>
                    {isLoading
                        ? <Fragment>
                            <div id="loading" className="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
                                <img src={Loader} alt="" />
                            </div>
                        </Fragment>
                        : <Fragment>
                            <div id="preview" className="w-100 h-100">
                                {imgSrc !== null ? <img src={imgSrc} className="w-100" height="244px" alt="" /> : ''}

                                <Table className="w-50 mt-5 border ml-5">
                                    <thead>
                                        <tr>
                                            <th className="border-right">#</th>
                                            <th className="border-right">File Name</th>
                                            <th className="border-right">File Size</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="row" className="border-right">1</th>
                                            <td className="border-right">{fileName}</td>
                                            <td className="border-right">{fileSize} mb</td>
                                        </tr>
                                    </tbody>
                                </Table>

                                <Form className="w-100 p-5" onSubmit={this.handleSubmit}>
                                    <FormGroup>
                                        <Input
                                            className="form-control border-top-0 border-left-0 border-right-0 bg-transparent"
                                            name="campaign_name"
                                            placeholder="Campaign Name"
                                            value={this.state.campaign_name}
                                            onChange={this.handleCampaignNameChange}
                                            required
                                        />
                                        <Input
                                            className="form-control border-top-0 border-left-0 border-right-0 bg-transparent"
                                            name="description"
                                            placeholder="description"
                                            value={this.state.description}
                                            onChange={this.handleDescriptionChange}
                                            required
                                        />
                                        <div className="d-flex flex-row mt-3 ml-1">
                                            <Button className="btn btn-dark" value="Submit">
                                                Submit
                                        </Button>
                                            <Button className="btn btn-danger ml-1" onClick={this.onCancel}>
                                                Cancel
                                        </Button>
                                        </div>
                                    </FormGroup>
                                </Form>
                            </div>
                        </Fragment>
                    }
                </Fragment>
            )
        }
        else {
            return (
                <section id="dropzone" className="w-100 h-100 p-5">
                    <Dropzone
                        onDrop={this.onDrop.bind(this)}
                        onFileDialogCancel={this.onCancel.bind(this)}
                        multiple={false}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps()}
                                className="dropzone w-100 h-100 d-flex flex-column justify-content-center align-items-center"
                            >
                                <p>Drop files here, or click to select files</p>
                                <input {...getInputProps()} />
                                <FontAwesomeIcon className="fa-2x" icon={faChevronCircleUp} />
                            </div>
                        )}
                    </Dropzone>
                </section>
            )
        }
    }
}

