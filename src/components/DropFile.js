import React,{Component} from 'react'
import Dropzone from 'react-dropzone'
import axios from 'axios'
import {Button,Form,FormGroup,Input,Table} from 'reactstrap'


export default class DropFile extends Component {
    constructor() {
        super()
        this.state = {
            description: "",
            campaign_name: "",
            file: [],
            imgSrc: null,
            fileName: "",
            fileSize: "",
            currentUser: JSON.parse(localStorage.getItem('currentUser'))
        }
      }

    handleDescriptionChange = (e) => {
        this.setState({description: e.target.value})
    }

    handleCampaignNameChange = (e) => {
        this.setState({campaign_name: e.target.value})
    }

    handleSubmit = (e) => {
        e.preventDefault()
        axios({
            method: 'post',
            url: 'http://127.0.0.1:5000/api/v1/media/upload',
            headers: {
                'content-type': 'multipart/form-data',
                'authorization': `Bearer ${localStorage.jwt}`
            },
            data: {
                "campaign_name": this.state.campaign_name,
                "description": this.state.description,
                "user_media": this.state.file[0],
                'user_id': this.state.currentUser.id
            }
          })
        .then( response => {
            // console.log(response)
            console.log(response);
            
        })
        .catch(error => {
            console.log(error);
            
        }); 
    }
    
    onDrop(file) {
        file.map(file => (
            this.setState({
                fileName: file.name,
                fileSize: (parseInt(file.size)/(Math.pow(1024,2))).toFixed(2)
            })
        ))

        const reader = new FileReader()
        reader.addEventListener("load",() => {
            console.log(reader.result);
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
          imgSrc: null
        });
      }

    render() {
        const {imgSrc,fileName,fileSize} = this.state
        
        if (this.state.file.length > 0) {
            return(
                <div id="preview" className="w-100">
                    {imgSrc !== null ? <img src={imgSrc} className="w-100" height="244px" alt=""/> : ''}

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
                                className = "form-control border-top-0 border-left-0 border-right-0 bg-transparent" 
                                name = "campaign_name" 
                                placeholder ="Campaign Name"
                                value={this.state.campaign_name}
                                onChange={this.handleCampaignNameChange}
                            />
                            <Input 
                                className = "form-control border-top-0 border-left-0 border-right-0 bg-transparent" 
                                name = "description" 
                                placeholder ="description"
                                value={this.state.description}
                                onChange={this.handleDescriptionChange}
                            />
                            <div className="d-flex flex-row mt-3 ml-1">
                                <Button className="btn btn-dark" value="Submit">
                                    Sumbit
                                </Button>
                                <Button className="btn btn-danger ml-1" onClick={this.onCancel}>
                                    Cancel
                                </Button>
                            </div>
                        </FormGroup>
                    </Form>
                </div>

            )
        }
        else{
            return (
                <section id="dropzone" className="w-100 h-100">
                    <Dropzone
                    onDrop={this.onDrop.bind(this)}
                    onFileDialogCancel={this.onCancel.bind(this)}
                    multiple={false}
                    >
                    {({getRootProps, getInputProps}) => (
                        <div {...getRootProps()}
                            className="border w-100 h-100 d-flex flex-column justify-content-center align-items-center"
                        >
                            <p>Drop files here, or click to select files</p>
                            <input {...getInputProps()} />
                            <Button color="primary">
                                Upload
                            </Button>
                        </div>
                    )}
                    </Dropzone>
              </section>
            )
        }
    }
}

