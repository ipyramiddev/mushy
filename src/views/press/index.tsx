import { useRef, useCallback } from 'react';
import { ReactComponent as Logo1 } from "../../assets/logo/de-full-dark.svg";
import { ReactComponent as Logo2 } from "../../assets/logo/de-full-light.svg";
import { ReactComponent as Logo3 } from "../../assets/logo/de-eyes-left.svg";
import { ReactComponent as Logo4 } from "../../assets/logo/de-eyes-right.svg";
import { Page } from "../../components/Page";

export const PressView = () => {

  const svgLogo1 = useRef<HTMLDivElement>(null);
  const svgLogo2 = useRef<HTMLDivElement>(null);
  const svgLogo3 = useRef<HTMLDivElement>(null);
  const svgLogo4 = useRef<HTMLDivElement>(null);

  function downloadBlob(blob:any, filename:string) {
    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
  }

  const downloadSVG = useCallback((ref, name) => {
    if( !ref.current ) return;
    const svg:HTMLElement = ref.current;
    const svgHtml = svg.innerHTML;
    const blob = new Blob([svgHtml], { type: "image/svg+xml" });
    downloadBlob(blob, `${name}.svg`);
  }, []);

  return (
    <Page title="Press Kit | DigitalEyes">
      <div className="container mx-auto">
        <div className="w-11/12 xl:w-full mx-auto pt-16">
          <div className="pt-4 pb-6 md:pb-8 lg:pb-10 xl:pb-12">
            <h1 className="xl:text-5xl text-3xl font-extrabold text-white">
              Press Kit
            </h1>
          </div>
          <div>
            <div className="mx-auto">
              <p className="mb-4">Please use the official DigitalEyes logos below when promoting or cross-promoting DigitalEyes.</p>
              <p className="mb-4">Also note: "DigitalEyes" is one word.</p>
              {/* <ol className="list-disc list-inside">
                <li></li>
              </ol> */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div>
                  <div ref={svgLogo1} className="bg-black p-5 mt-5 mb-2 h-24 flex items-center">
                    <Logo1 className="mx-auto"/>
                  </div>
                  <button onClick={() => downloadSVG(svgLogo1, 'DigitalEyes-Dark')} className="mx-5">Download</button>
                </div>   
                <div>
                  <div ref={svgLogo2} className="bg-gray-100 p-5 mt-5 mb-2 h-24 flex items-center">
                    <Logo2 className="mx-auto"/>
                  </div>
                  <button onClick={() => downloadSVG(svgLogo2, 'DigitalEyes-Light')} className="mx-5">Download</button>
                </div>
                <div>
                  <div ref={svgLogo3} className="bg-gray-100 p-5 mt-5 mb-2 h-24 flex items-center">
                    <Logo3 className="mx-auto h-24"/>
                  </div>
                  <button onClick={() => downloadSVG(svgLogo3, 'DigitalEyes-Left')} className="mx-5">Download</button>
                </div>   
                <div>
                  <div ref={svgLogo4} className="bg-gray-100 p-5 mt-5 mb-2 h-24 flex items-center">
                    <Logo4 className="mx-auto h-24"/>
                  </div>
                  <button onClick={() => downloadSVG(svgLogo4, 'DigitalEyes-Right')} className="mx-5">Download</button>
                </div>   
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};
