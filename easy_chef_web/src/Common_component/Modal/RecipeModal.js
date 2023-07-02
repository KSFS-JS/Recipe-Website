import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function RecipeModal(props) {
    return (
        <div
            className="modal show"
            style={{ display: 'block', position: 'initial' }}
        >
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>{props.Title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Are you sure you want to {props.Action}?</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-dark">Cancel</Button>
                    <Button variant="outline-dark">Submit</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>
    );
}

export default RecipeModal;