"use client"
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
export default function DonationModal() {
  const [show, setShow] = useState(false);

  return (
    <>
      <Button className="shadow-sm" style={{width:"200px", border:"3px solid #a1c9d8", backgroundColor:"white", color:"#4e4e4e", height:"30px", fontSize:"20px", borderRadius:"10px", display:"flex", justifyContent:"space-between", alignItems:"center"}} variant="primary" onClick={() => setShow(true)}>
        رفع محتوى
        <FontAwesomeIcon icon={faBook} style={{color:"#a1c9d8", fontSize:"20px"}}></FontAwesomeIcon>
      </Button>

      <Modal
        className="modal-lg" 
        show={show} 
        onHide={() => setShow(false)} 
        centered
      >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body style={{ padding: '20px',height:"500px", overflow:"hidden" }}> 
          <Tab.Container style={{height:"100%", overflowY:"auto"}} defaultActiveKey="first">
            <Nav variant="tabs" style={{display:"flex", justifyContent:"space-between" ,width:"100%", margin:"10px"}}>
              <Nav.Item>
                <Nav.Link style={{color:"gray", fontSize:"18px"}} eventKey="first">معلومات المحتوى</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link style={{color:"gray", fontSize:"18px"}} eventKey="second">رفع الملف</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link style={{color:"gray", fontSize:"18px"}} eventKey="third">الوصف والإعدادات</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link style={{color:"gray", fontSize:"18px"}} eventKey="forth">نشر</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="first">
                <p style={{color:"black", fontSize:"20px", margin:"15px"}}>عنوان المحتوى :</p>
                <input
                  placeholder="أدخل عنوان الدرس أو الواجب ..." 
                  style={{
                    backgroundColor: "white", 
                    borderRadius: "30px", 
                    border:"none",
                    width: "100%", 
                    height: "40px",
                    padding:"15px",
                    fontSize:"16px",
                  }} 
                  type="text" 
                />
                <p style={{color:"black", fontSize:"20px", margin:"15px"}}>نوع المحتوى :</p>
                     <div style={{display:"flex", flexDirection:"column", paddingRight:"100px"}}>
                        <label style={{fontSize:"18px"}}><input  type="radio" name="option" value="option1"/> درس </label>
                        <label style={{fontSize:"18px"}}><input  type="radio" name="option" value="option2"/> واجب </label>
                     </div>
                <p style={{color:"black", fontSize:"20px", margin:"15px"}}>المادة :</p>
                 <input 
                  style={{
                    backgroundColor: "white", 
                    borderRadius: "30px", 
                    border:"none",
                    width: "100%", 
                    height: "40px",
                    marginBottom:"40px",
                    padding:"10px",
                    fontSize:"16px"
                  }} 
                  type="text" 
                />
                <div style={{display:"flex", justifyContent:"end"}}>
                  <button style={{border:"1px solid black", width:"150px", height:"45px", textAlign:"center", fontSize:"18px", borderRadius:"5px"}}>التالي</button>
                </div>  
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <p style={{color:"black", fontSize:"20px", margin:"40px", marginBottom:"30px"}}> نوع الملف:</p>
                <select  style={{
                    backgroundColor: "white", 
                    borderRadius: "30px", 
                    border:"none",
                    width: "100%", 
                    height: "50px",
                    marginBottom:"40px",
                    padding:"15px"
                  }} >
                  <option>pdf</option>
                  <option>mp4</option>
                </select>
                <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                  <button style={{borderRadius:"30px",height:"40px", border:"1px solid black", width:"150px", textAlign:"center"}}>رفع الملف</button>
                </div>
                <div style={{display:"flex", justifyContent:"space-between",marginTop:"120px"}}>
                  <button style={{border:"1px solid black", width:"150px", height:"45px", textAlign:"center", fontSize:"18px", borderRadius:"5px"}}>السابق</button>
                  <button style={{border:"1px solid black", width:"150px", height:"45px", textAlign:"center", fontSize:"18px", borderRadius:"5px"}}>التالي</button>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="third">
                <p style={{color:"black", fontSize:"20px", margin:"15px"}}>الوصف : </p>
                <textarea
                  rows={4}
                  placeholder="أدخل وصف المحتوى"
                  style={{
                    backgroundColor: "white", 
                    borderRadius: "30px", 
                    border:"none",
                    width: "100%", 
                    height: "40px",
                    padding:"15px",
                    fontSize:"16px"
                  }} 
                  type="text" 
                />
                <div style={{display:"flex", flexDirection:"column", paddingRight:"10px", margin:"20px"}}>
                        <label style={{fontSize:"18px"}}><input  type="radio" name="option" value="option1"/> إرسال إشعار للطلاب عند النشر</label>
                     </div>
                      <p style={{color:"black", fontSize:"20px", margin:"30px 15px"}}>آخر موعد للتسليم :</p> 
                      <input 
                      style={{
                    backgroundColor: "white", 
                    borderRadius: "30px", 
                    border:"none",
                    width: "100%", 
                    height: "40px",
                    padding:"15px",
                    fontSize:"16px"
                  }} type="date" ></input>
                  <div style={{display:"flex", justifyContent:"space-between",marginTop:"70px"}}>
                  <button style={{border:"1px solid black", width:"150px", height:"45px", textAlign:"center", fontSize:"18px", borderRadius:"5px"}}>السابق</button>
                  <button style={{border:"1px solid black", width:"150px", height:"45px", textAlign:"center", fontSize:"18px", borderRadius:"5px"}}>التالي</button>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Modal.Body>
      </Modal>
    </>
  );
}


