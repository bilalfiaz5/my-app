
import axios from 'axios';
import { useState } from 'react';


function App() {

  const [ProductData, setProductData] = useState({});

  const getData = async () => {
    var productSlug = 'rntr-recruitment-only-product';
    var productApi = `https://app.getrntr.com/api/products/v2/by-location?url=${productSlug}`;
    try {
      const response = await axios.get(productApi);
      setProductData(JSON.stringify(response.data));
    }
    catch (err) {

    }
  }

  return (

    <div className="App">
      <header className="App-header" >
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          onClick={getData}
        >
          Learn React
        </a>
        <p onClick={ProductData}>Samee</p>
      </header>
    </div>
  );
}

export default App;
