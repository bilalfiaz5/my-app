import { Fragment, useState, useEffect } from "react";
import axios from 'axios';
import Duration from './Duration';



function Buttons(props) {

    const skus = props.productInfo.SKUs;
    const [Sku, setSku] = useState({ sku: skus[0], index: 0 });
    const [SkuData, setSkuData] = useState([]);

    useEffect(() => {
        (async () => {
            await getSku(Sku);
            console.log(Sku);
        })()
    }, [Sku])

    const getSku = async (sku) => {
        const id = sku.sku.strId;
        var skuApi = `https://app.getrntr.com/api/skus/${id}/availability/distribution`;
        try {
            const response = await axios.get(skuApi);
            setSkuData(response.data);
        }
        catch (err) {
            console.log(err);
        }
    }

    const setProductSku = (sku, index) => {
        setSku({ sku: sku, index: index });
    }
   
    return (
        <Fragment>
            <div className="h3--size">Size</div>
            {
                skus.map((sku, index) => {
                    return <Fragment>
                        <button className={`btn btn--size ${Sku.index === index ? "active" : null}`} onClick={() => setProductSku(sku, index)}>{sku.size}</button></Fragment>
                })
            }
            <hr />
             <Duration duration={Sku.sku.pricing} productSku={SkuData}/>
            <br />
        </Fragment>
    );
}

export default Buttons;