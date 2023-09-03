import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import '../App.css'

export const Contact = () => {
  const form = useRef();
  const [user_name, setUser_name] = useState("");
  const [user_email, setUser_email] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setUser_name("");
    setUser_email("");
    setMessage("");
   
    emailjs
      .sendForm(
        "service_16hnnvp",
        "template_v33im4d",
        form.current,
        "Xpn6qACO6ESB3EJx4"
      )
      .then(
        (result) => {
           emailjs.send("service_16hnnvp", "template_v33im4d");
          console.log(result.text);
          
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <div className="contact">
        <p>
        <h1>Contact us</h1>
          Welcome to our Contact page! Your feedback is essential in helping us
          create a better experience for you. If you've encountered a bug or
          have a suggestion for improvement, we'd love to hear from you. Please
          take a moment to let us know about any issues you've come across while
          using our platform. Your detailed insights will allow us to swiftly
          address any bugs and enhance your overall experience. Additionally, we
          value your feedback on how we can make our platform even more
          user-friendly and efficient. Your suggestions are crucial in shaping
          the future of our service. Thank you for being an integral part of our
          journey to provide you with the best possible communication
          experience.
        </p>
    <div className="content-t">
      <div className="form">
        <form ref={form} onSubmit={sendEmail}>
          <label>Name</label>
          <input
            type="text"
            name="user_name"
            value={user_name}
            onChange={(e) => setUser_name(e.target.value)}
          />
          <label>Email</label>
          <input
            type="email"
            name="user_email"
            value={user_email}
            onChange={(e) => setUser_email(e.target.value)}
          />
          <label>Message</label>
          <textarea
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <input type="submit" value="Send" />
        </form>
        {isSubmitted && <p>Form submitted successfully!</p>}
      </div>
    </div>
    </div>
  );
};
