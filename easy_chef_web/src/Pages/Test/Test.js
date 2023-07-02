import * as React from "react";

import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Video from "yet-another-react-lightbox/plugins/video";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import {Button} from "react-bootstrap";


export default function BasicExample() {
    const [basicExampleOpen, setBasicExampleOpen] = React.useState(false);
    const [advancedExampleOpen, setAdvancedExampleOpen] = React.useState(false);

    return (
        <>
            <Button onClick={() => setBasicExampleOpen(true)}>123</Button>
            <Lightbox
                open={advancedExampleOpen}
                close={() => setAdvancedExampleOpen(false)}

                plugins={[Captions, Fullscreen, Slideshow, Thumbnails, Video, Zoom]}
            />


            <Lightbox
                open={basicExampleOpen}
                close={() => setBasicExampleOpen(false)}

            />

        </>
    );
}