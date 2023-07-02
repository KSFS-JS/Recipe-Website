import React from "react";
import {Avatar, Grid, Paper, Rating} from "@mui/material";
import "yet-another-react-lightbox/styles.css";


export default function CommentSection (props){
    return (
        <div style={{ padding: 14 }} className="Comments">
                    {props.CommentData.map((d, i) => {
                        return (
                            <Paper style={{ padding: "40px 20px", marginTop: "20px"}} key={"top_"+i}>
                                <Grid container wrap="nowrap" spacing={2}>
                                    <Grid item>
                                        <Avatar alt="Remy Sharp" src={"http://127.0.0.1:8000"+d.avatar} />
                                    </Grid>
                                    <Grid justifyContent="left" item xs zeroMinWidth>
                                        <h4 style={{ margin: 0, textAlign: "left" }}>{d.name}</h4>
                                        <Rating readOnly value={parseFloat(d.rating)}/>
                                        <p style={{ textAlign: "left" }}>
                                            {d.comment}
                                        </p>
                                    </Grid>
                                </Grid>
                            </Paper>
                        )
                    })}


        </div>
    );
}