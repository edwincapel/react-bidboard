import React,{Component,Fragment} from 'react'
import Dropzone from 'react-dropzone'
import {Button} from 'reactstrap'

export default class DropFile extends Component {
    constructor() {
        super()
        this.state = {
          file: []
        }
      }
    
      onDrop(file) {
        this.setState({file});
      }
    
      onCancel() {
        this.setState({
          file: []
        });
      }

    render() {
        const file = this.state.file.map(file => (
            <li key={file.name}>
              {file.name} - {file.size} bytes
            </li>
          ))

        console.log(file[0]);
        
        if (this.state.file.length > 0) {
            return(
                <Fragment>
                    <h1>File Preview here with description input here</h1>
                    <ul>{file}</ul>
                </Fragment>
            )
        }
        else{
            return (
                <section id="dropzone" className="border w-100 h-100">
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

