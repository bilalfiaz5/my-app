
import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import Buttons from './Buttons';
import './styles/index.css';
import { DatePicker } from 'antd';
import moment from 'moment';
const { RangePicker } = DatePicker;
function App() {

  const [ProductData, setProductData] = useState();
  const [SkuData, setSkuData] = useState([]);
  const [productImages, setproductImages] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    (async () => {
      let status = await getProductData();
      if (status == 200) {
        setloading(true);
      }
    })()
    console.log(loading);
  }, [])

  const getSku = async (sku) => {
    var skuApi = `https://app.getrntr.com/api/skus/${sku}/availability/distribution`;
    try {
      const response = await axios.get(skuApi);
      setSkuData(response.data);
    }
    catch (err) {
      console.log(err);
    }
  }

  const getImage = (image) => {
    image.map((image_id) => {
      var imageApi = `https://app.getrntr.com/api/media/${image_id}`;
      productImages.push(imageApi);
      setproductImages([...productImages]);
    });
  }

  const getProductData = async () => {
    var productSlug = 'rntr-recruitment-only-product';
    var productApi = `https://app.getrntr.com/api/products/v2/by-location?url=${productSlug}`;
    try {
      const response = await axios.get(productApi);
      setProductData(response.data);
      getSku(response.data.SKUs[0].strId);
      getImage(response.data.product.images);
      return response.status;
    }
    catch (err) {
      console.log(err);
    }
  }

  const printData = () => {
    console.log(ProductData);
    console.log(SkuData);
    console.log(productImages);
  }


  function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }


  return (
    <Fragment>
      {loading ? (
        <div class="container">
          <div class="imgBx">
            <img src={productImages[0]} onClick={printData} />
          </div>
          <div class="details">
            <div class="content">
              <div className='h4--vendor'>RNTR</div>
              <div className='h1--title'>Hello this s the title</div>

              <Buttons information={ProductData} />
              <hr className='divider' />
              <br />
              <RangePicker disabledDate={disabledDate} />
              <h3>Rs. 12,800</h3>
              <button>Buy Now</button>
            </div>
          </div>
        </div>
      ) : (<p>No user found, please try again</p>
      )
      }
    </Fragment>

  );
}

export default App;
