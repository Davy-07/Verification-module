import { React, useState, useEffect } from "react";
import "../../styles/Card.css";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { getfile, getPaymentFile } from "../../apis/firebasecloud.js";
import { updateQuery } from "../../apis/firestoreDatabase";

//for color of status circles
function colorScheme(variable) {
  var color = "yellow";
  if (variable === "Verified") color = "green";
  else if (variable === "Denied") color = "red";
  return color;
}

async function declineButtonClick(userId, queryId, dmessage) {
  const element = document.getElementById("inputDelineAddress");
  console.log("Message ->" + element.innerHTML);
  axios.post("/declineQuery", { message: dmessage });
  await updateQuery(userId, queryId, 0);
}

//function for hitting apis in backend for send certificates
async function verifyDocument(dataObject) {
  await axios.post("/MakeCert", { data: dataObject });
  await updateQuery(dataObject.CompEmail, dataObject.queryId, 1);
  alert("Mail in Progess");
}

export default function Card(props) {
  //Use State for invoking close and open button

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setDisable(false);
    setShow(false);
    setdeclineButton(false);
  };
  const handleShow = () => setShow(true);

  //for disabling document fetching button

  const [disable, setDisable] = useState(false);
  const [declineButton, setdeclineButton] = useState(false);
  let [declineMessage, setdeclineMessage] = useState(" ");
  let [statusVerify,setstatusVerify]=useState(false);
  useEffect(() => {
    try {

      if(props.status==="Verified" || props.status==="Denied"){
        console.log(props.status)
        setstatusVerify(true)
      }
      const element = document.getElementById("inputDelineAddress");
      element.innerHTML = declineMessage;
    } catch (err) {}
  }, [declineMessage]);

  return (
    <div>
      <div
        className="main_card_container"
        style={{
          backgroundColor: `${props.color}`,
          margin: 5,
        }}
      >
        <div
          className="rounded-circle"
          style={{
            backgroundColor: colorScheme(props.status),
            width: "15px",
            height: "15px",
          }}
        ></div>
        <div className="valueContainer">
          <h2 className="card_heading">{props.date}</h2>
        </div>
        <div className="valueContainer">
          <h2 className="card_heading">{props.queryId}</h2>
        </div>
        <div className="valueContainer">
          <h2 className="card_heading">{props.name}</h2>
        </div>
        <div className="valueContainer">
          <h2 className="card_heading">{props.prn}</h2>
        </div>
        <div className="valueContainer">
          <Button variant="primary" onClick={handleShow}>
            View document
          </Button>
        </div>

        {/* Modal for Showing Full Information */}

        <Modal show={show} onHide={handleClose} animation={false}>
          {/* Header for the modal */}
          <div>
            <Modal.Header closeButton>
              <Modal.Title style={{ fontSize: "1.25rem" }}>
                ID : {props.queryId}
              </Modal.Title>
              <p
                style={{ fontSize: "0.95rem", margin: 0, marginLeft: "2.6vw" }}
              >
                {props.status}
              </p>
            </Modal.Header>
          </div>
          {/*Main Body of the Modal */}

          <Modal.Body
            id="MainBodyContainer"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div
              style={{
                overflow: "auto",
                height: "300px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                <p className="content">Query Date :</p>
                <p className="content">{props.date}</p>
              </div>
              <hr></hr>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <p className="content">Name :</p>
                <p className="content">{props.name}</p>
              </div>
              <hr></hr>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <p className="content">Email :</p>
                <p className="content">{props.email}</p>
              </div>
              <hr></hr>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <p className="content">Agency Number :</p>
                <p className="content">{props.compContactNumber}</p>
              </div>
              <hr></hr>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <p className="content">Agency Name :</p>
                <p className="content">{props.CompName}</p>
              </div>
              <hr></hr>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <p className="content">Agency Email :</p>
                <p className="content">{props.CompEmail}</p>
              </div>
              <hr></hr>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <p className="content">Designation :</p>
                <p className="content">{props.compContactPersonal}</p>
              </div>
              <hr></hr>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <p className="content">University Name :</p>
                <p className="content">{props.Uni}</p>
              </div>
              <hr></hr>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <p className="content">Program Name :</p>
                <p className="content">{props.Prog}</p>
              </div>
              <hr></hr>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <p className="content">PRN :</p>
                <p className="content">{props.prn}</p>
              </div>
              <hr></hr>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <p className="content">Graduation Date :</p>
                <p className="content">{props.PYear}</p>
              </div>
              <hr></hr>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <p className="content">Document :</p>
                <p className="content">{props.docs}</p>
              </div>
              <hr></hr>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <p className="content">NEFT :</p>
                <p className="content">{props.NEFT}</p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer style={{ justifyContent: "center" }}>
            <Button
              variant="primary"
              onClick={async () => {
                await getPaymentFile(props, props.CompEmail, props.queryId);
              }}
            >
              Send to Verify Payment
            </Button>
            <Button
              disabled={declineButton}
              variant="danger"
              onClick={async () => {
                setdeclineButton(true);
                var container = document.getElementById("MainBodyContainer");

                //creating text input
                const inputdecline = document.createElement("textarea");
                inputdecline.rows = 5;
                inputdecline.id = "inputDelineAddress";
                inputdecline.onchange = (e) => {
                  setdeclineMessage(e.target.value);
                };
                container.appendChild(inputdecline);

                //creating button
                const buttonDecline = document.createElement("button");
                buttonDecline.innerHTML = "Send";
                buttonDecline.className = "btn btn-primary";
                buttonDecline.onclick = async () => {
                  declineButtonClick(
                    props.CompEmail,
                    props.queryId,
                    inputdecline.innerHTML
                  );
                };
                container.appendChild(buttonDecline);
              }}
            >
              Decline Query Request
            </Button>
            <Button
              disabled={disable}
              variant="primary"
              onClick={async () => {
                await getfile(props.CompEmail, props.queryId);
                setDisable(true);
              }}
            >
              View Documents
            </Button>
            <Button
              disabled={statusVerify}
              variant="success"
              onClick={() => {
                verifyDocument(props);
              }}
            >
              Verify Request
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
