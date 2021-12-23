import { Fragment, useState } from "react";
import Duration from './Duration';

function Buttons(props) {
    const skus = props.information.SKUs;
    const [Sku, setSku] = useState({ sku: skus[0], index: 0 });
    const setProductSku = (sku, index) => {
        setSku({ sku: sku, index: index });
    }

    return (
        <Fragment>
            <div className="h3--size">Size</div>
            {
                skus.map((sku, index) => {
                    return <Fragment>
                        <button className={`btn btn--size ${Sku.index === index ? "active" : null}`} onClick={() => setProductSku(sku, index)}>{sku.size}</button>
                        {/* <Button type="primary" shape="round" icon={<DownloadOutlined />} size='large' value={}/> */}
                        <Duration duration={sku.pricing} />
                    </Fragment>
                })
            }
        </Fragment>
    );
}

export default Buttons;