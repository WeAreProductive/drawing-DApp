import {
  Button,
  Checkbox,
  Label,
  Modal,
  TextInput,
  Textarea,
} from "flowbite-react";
import { useEffect, useRef, useState } from "react";

const InputDialog = ({ isOpen }) => {
  const [openModal, setOpenModal] = useState(false);
  console.log({ isOpen });
  console.log({ openModal });
  const titleInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setOpenModal(isOpen);
  }, [isOpen]);
  return (
    <>
      <Modal
        show={openModal}
        size="md"
        popup
        onClose={() => setOpenModal(false)}
        initialFocus={titleInputRef}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Give us more info about your drawing:
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="title" value="Drawing title" />
              </div>
              <TextInput
                id="title"
                ref={titleInputRef}
                placeholder="Drawing title ..."
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="description" value="Drawing description" />
              </div>

              <Textarea id="description"></Textarea>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="price" value="Minting Price" />
              </div>
              {/* Number input */}
              <TextInput id="price" placeholder="Minting price" required />
            </div>
            <div>public/private radio buttons</div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {/* add handler onClick continue*/}
          <Button color="green" onClick={() => setOpenModal(false)}>
            Continue
          </Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InputDialog;
