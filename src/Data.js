import { Fragment, useState, useEffect } from "react";
import axios from 'axios';
import Duration from './Duration';


function Data(props) {
    // contains all sku of the product
    const skus = props.productInfo.SKUs;
    // Select the first sku by default
    const [Sku, setSku] = useState({ sku: skus[0], index: 0 });
    const [SkuData, setSkuData] = useState([]);

    // get the sku information of first sku by default
    useEffect(() => {
        (async () => {
            await getSku(Sku);
        })()
    }, [Sku])

    // get the sku information of selected sku from the sku api and set data using states
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

    // set the selected sku
    const setProductSku = (sku, index) => {
        setSku({ sku: sku, index: index });
    }
   
    return (
        <Fragment>
            <div className="h3--size">Size</div>
            {
                // Shows the all sku from the product
                skus.map((sku, index) => {
                    return <Fragment>
                        <button className={`btn btn--size ${Sku.index === index ? "active" : null}`} onClick={() => setProductSku(sku, index)} key={index+1} >{sku.size}</button></Fragment>
                })
            }
            <hr />
            {/* Display the remaining information of product */}
             <Duration duration={Sku.sku.pricing} productSku={SkuData}/>
            <br />
        </Fragment>
    );
}

export default Data;