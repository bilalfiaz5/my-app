import { Fragment, useState } from "react";

function Duration(props) {
    const durations = props.duration;
    const [Duration, setDuration] = useState({
        duration: durations[0],
        index: 0
    });

    const setProductDuration = (duration, index) => {
        setDuration({ duration: duration, index: index });
    }

    return (
        <Fragment>
            <div className="h3--size">Rental Duration (Days)</div>
            {
                durations.map((duration, index) => {
                    return <Fragment>
                        <button className={`btn btn--size ${Duration.index === index ? "active" : null}`} onClick={() => setProductDuration(duration, index)} >{duration.value}</button>
                    </Fragment>
                })
            }
        </Fragment>
    );
}

export default Duration;