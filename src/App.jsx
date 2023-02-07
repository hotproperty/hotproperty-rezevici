import { useEffect, useRef, useState } from 'react';
import { ReactComponent as LogoSvg } from './assets/logo.svg';

import Iso from "./Iso";


const DATA = {
  '1.1': { id: '094127', area: 100, price: 10_000, sold: false, bedrooms: 1, bathrooms: 1 },
  '1.2': { id: '238123', area: 100, price: 12_100, sold: false, bedrooms: 1, bathrooms: 1 },
  '1.3': { id: '410232', area: 101, price: 11_200, sold: false, bedrooms: 1, bathrooms: 1 },
  '1.4': { id: '329085', area: 109, price: 10_200, sold: false, bedrooms: 1, bathrooms: 1 },
  '2.1': { id: '054321', area: 120, price: 12_500, sold: false, bedrooms: 1, bathrooms: 1 },
  '2.2': { id: '502438', area: 111, price: 10_500, sold: false, bedrooms: 1, bathrooms: 1 },
  '2.3': { id: '503821', area: 100, price: 10_000, sold: false, bedrooms: 1, bathrooms: 1 },
  '2.4': { id: '004832', area: 100, price: 10_000, sold: false, bedrooms: 1, bathrooms: 1 },
  '3.1': { id: '214082', area: 100, price: 10_000, sold: false, bedrooms: 1, bathrooms: 1 },
  '3.2': { id: '690782', area: 100, price: 10_000, sold: false, bedrooms: 1, bathrooms: 1 },
  '3.3': { id: '250298', area: 100, price: 10_000, sold: true, bedrooms: 1, bathrooms: 1 },
  '3.4': { id: '219031', area: 100, price: 10_000, sold: true, bedrooms: 1, bathrooms: 1 },
  '3.5': { id: '430928', area: 100, price: 10_000, sold: true, bedrooms: 1, bathrooms: 1 },
  '3.6': { id: '985023', area: 100, price: 10_000, sold: true, bedrooms: 1, bathrooms: 1 },
  '4.1': { id: '183246', area: 100, price: 10_000, sold: false, bedrooms: 1, bathrooms: 1 },
  '4.2': { id: '509238', area: 100, price: 10_000, sold: false, bedrooms: 1, bathrooms: 1 },
  '4.3': { id: '023148', area: 100, price: 10_000, sold: false, bedrooms: 1, bathrooms: 1 },
  '4.4': { id: '301289', area: 100, price: 10_000, sold: false, bedrooms: 1, bathrooms: 1 },
  '5.1': { id: '301292', area: 100, price: 10_000, sold: false, bedrooms: 1, bathrooms: 1 },
  '5.2': { id: '460129', area: 100, price: 10_000, sold: false, bedrooms: 1, bathrooms: 1 },
  '5.3': { id: '401283', area: 100, price: 10_000, sold: false, bedrooms: 1, bathrooms: 1 },
  '5.4': { id: '213092', area: 100, price: 10_000, sold: false, bedrooms: 1, bathrooms: 1 },
  '6.1': { id: '560139', area: 100, price: 10_000, sold: false, bedrooms: 1, bathrooms: 1 },
  '6.2': { id: '222139', area: 100, price: 10_000, sold: false, bedrooms: 1, bathrooms: 1 },
  '6.3': { id: '644129', area: 100, price: 10_000, sold: false, bedrooms: 1, bathrooms: 1 },
  '6.4': { id: '234292', area: 100, price: 10_000, sold: false, bedrooms: 1, bathrooms: 1 },
}


function isTouchDevice () {
  return (
    ('ontouchstart' in window) ||
    !!(navigator.maxTouchPoints > 0) ||
    !!(navigator.msMaxTouchPoints > 0)
  );
}


function App() {
  const houseRefs = useRef({});
  const tooltipRef = useRef(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState(null);

  const addHouseRef = (ref) => {
    if (ref && ref.dataset.name) {
      houseRefs.current[ref.dataset.name] = ref;

      if (isTouchDevice()) {
        // touch devices
        ref.onclick = onPolygonTouch;
      } else {
        // pointer devices
        ref.onmouseenter = (e) => onPolygonEnter(e.target);
        ref.onmouseleave = (e) => onPolygonLeave(e.target);
      }

      if (DATA[ref.dataset.name]?.sold === true) {
        ref.style.pointer = 'cursor';
      }
    }
  }

  const onPolygonTouch = (e) => {
    document.querySelectorAll('[data-hovered="true"]').forEach(
      poly => onPolygonLeave(poly)
    )
    onPolygonEnter(e.target);
  }

  const onPolygonEnter = (poly) => {
    poly.style.fill = 'rgba(0, 0, 0, 0.1)';
    poly.dataset.hovered = true;
    let data = DATA[poly.dataset.name];
    setTooltipData(data ? { ...data, key: poly.dataset.name } : null);
    setTooltipVisible(true);
  }

  const onPolygonLeave = (poly) => {
    poly.style.fill = 'transparent';
    poly.dataset.hovered = false;
    setTooltipVisible(false);
  }

  useEffect(() => {
    function followMouse (e) {
      if (tooltipRef.current) {
        let { width, height } = tooltipRef.current.getBoundingClientRect();
        tooltipRef.current.style.top = `${e.pageY - height - 50}px`;
        tooltipRef.current.style.left = `${e.pageX - (width / 2)}px`;
      }
    }

    window.addEventListener('mousemove', followMouse)
    return () => window.removeEventListener('mousemove', followMouse)
  }, [tooltipRef])  // eslint-disable-line

  useEffect(() => {
    function onTouchOutside(e) {
      if (e.target.nodeName !== "polygon") {
        document.querySelectorAll('[data-hovered="true"]').forEach(
          poly => onPolygonLeave(poly)
        )
      }
    }

    if (isTouchDevice()) {
      console.log('is touch device')
      document.addEventListener("touchstart", onTouchOutside);
    }

    return () => document.removeEventListener("touchstart", onTouchOutside);
  }, [])

  return (
    <div className="max-w-screen-2xl mx-auto">
      <header className="flex justify-between items-center py-vw-12 px-vw-8">
        <LogoSvg className="sm:w-vw-40 w-vw-60" />
        <p className="text-vw-3xl font-bold">REZEVICI BB</p>
      </header>

      <div className="relative sm:py-vw-10 pb-vw-8">
        <div className="sm:absolute left-vw-8 top-0 mt-vw-4 sm:mb-0 mb-vw-4 px-vw-10 sm:px-0">
          <p className="sm:text-vw-2xl text-vw-4xl">
            Добро пожаловать в интерактивную<br className="sm:hidden" /> модель <br className="hidden sm:inline"/>
            проекта <b>Rezevici bb</b>!<br/>
          </p>
          <p className="sm:text-vw-lg text-vw-2xl mt-vw-4">
            <b>Наведитесь на какую-нибудь из квартир.</b><br/>
            После этого можете нажать на ту которая вам понравилась<br/>чтобы перейти на страницу с подробной информацией о ней.
          </p>
        </div>

        <div className="w-screen sm:w-full overflow-auto">
          <div>
            <div className="sm:px-0 px-vw-8">
              <Iso
                refs={addHouseRef}
                className="h-[calc(100vh-28vh)] sm:h-auto sm:w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <footer className="flex justify-between items-center p-vw-8 bg-gray-light mb-vw-10 mx-vw-8">
        <LogoSvg className="w-vw-40" />

        <div className="flex">
          <a href="https://instagram.com/hotproperty_montenegro" className="text-vw-lg bg-gray hover:bg-gray-hover px-vw-4 py-vw-2">
            INSTAGRAM
          </a>
          <a href="https://www.facebook.com/kvartirachernogoriya/" className="text-vw-lg bg-gray hover:bg-gray-hover px-vw-4 py-vw-2 ml-vw-2">
            FACEBOOK
          </a>
          <a href="tel:+38267088496" className="text-vw-lg bg-gray hover:bg-gray-hover px-vw-4 py-vw-2 ml-vw-2">
            +382 67 088 496
          </a>
        </div>
      </footer>

      <div
        ref={tooltipRef}
        className="after-triangle bg-gray-light border-2 border-red transition-opacity pointer-events-none absolute"
        style={{ opacity: tooltipVisible ? 1 : 0 }}
      >
        {tooltipData && (
          <div className="w-vw-56 p-vw-5">
            <table className="table-auto w-full text-vw-base">
              <tbody>
                <tr>
                  <td colSpan={2}>
                    <b>Квартира {tooltipData.key} #{tooltipData.id}</b>
                  </td>
                </tr>
                <tr>
                  <td>Площадь</td>
                  <td className="text-right">
                    <b>{tooltipData.area} м2</b>
                  </td>
                </tr>
                {/* <tr>
                  <td>Спален</td>
                  <td className="text-right">
                    <b>{tooltipData.bedrooms}</b>
                  </td>
                </tr>
                <tr>
                  <td>Санузлов</td>
                  <td className="text-right">
                    <b>{tooltipData.bathrooms}</b>
                  </td>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr> */}
                <tr>
                  <td>Цена</td>
                  <td className="text-right">
                    <b>{tooltipData.price} €</b>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <p className="text-vw-sm mt-vw-2">
                      Нажмите для подробной информации
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


export default App;
