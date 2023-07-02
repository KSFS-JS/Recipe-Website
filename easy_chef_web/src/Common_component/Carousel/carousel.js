import React from 'react';
import {Carousel, Container} from "react-bootstrap";

const MyCarousel = (props) => {
    let urls = []
    if (props.ImageURL){
        urls = props.ImageURL
        return (
            <Container>
                <Carousel fade style={{width:"1024px", height:"768px", margin:"auto"}}>
                    {urls.map((url, i) => {
                        return (
                            <Carousel.Item key={url+i}>
                                <img
                                    className="d-block"
                                    src={`http://127.0.0.1:8000/${url}` }
                                    alt="First slide"
                                    style={{height:"768px", width:"1024px"}}
                                />
                            </Carousel.Item>
                        )
                    })}
                </Carousel>
            </Container>
        );
    }
}

export default MyCarousel;