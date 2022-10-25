import React, { useEffect, useState, useCallback, useContext } from "react";
import {
  Steps,
  Row,
  Button,
  Upload,
  Col,
  Input,
  Statistic,
  Spin,
  InputNumber,
  Form,
  Typography,
  Space,
  Card,
} from "antd";
//@ts-ignore
import { IKImage } from "imagekitio-react";
import { getImagePath, IMAGE_KIT_ENDPOINT_OLDURL, isImageInCache } from "../../constants/images";
import { GET_AUTHED_DETAILS } from "../../constants/urls";
import * as ROUTES from "../../constants/routes";
import Slider from "@mui/material/Slider";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import {
  mintNFT,
  MAX_METADATA_LEN,
  IMetadataExtension,
  Attribute,
  MetadataCategory,
  Creator,
  MetadataFile,
} from "../../actions";
import { useConnection, useConnectionConfig, useTokenList } from "../../contexts";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWallet as useWallet0 } from "../../contexts/wallet";

import { Connection } from "@solana/web3.js";
import { MintLayout } from "@solana/spl-token";
import { useHistory, useParams } from "react-router-dom";
import {
  cleanName,
  getLast,
  shortenAddress,
  StringPublicKey,
  WRAPPED_SOL_MINT,
  LAMPORT_MULTIPLIER,
  getAssetCostToStore,
  getCircularReplacer,
} from "../../utils";
import { SoloWalletSigner } from "../../components/SoloWalletSigner";
import { Page } from "../../components/Page";
import useWindowDimensions from "../../utils/layout";
import { LoadingOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  PlusCircleIcon,
  MinusCircleIcon,
  TrashIcon,
  MusicNoteIcon,
} from "@heroicons/react/outline";
import { HTMLContent } from "../../components/NftTypes";
import { LoadingWidget } from "../../components/loadingWidget";
import AudioContext, { IAudioContext } from "../../contexts/audio";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import {
  ClipboardCheckIcon,
  CloudUploadIcon,
  PaperAirplaneIcon,
  InformationCircleIcon,
  TicketIcon,
  CheckCircleIcon,
} from "@heroicons/react/outline";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";

import "./styles.css";

const { Dragger } = Upload;
const { Text } = Typography;

export const ArtCreateView = () => {
  const connection = useConnection();
  const { env } = useConnectionConfig();
  const wallet = useWallet0();
  const [alertMessage, setAlertMessage] = useState<string>();
  const { step_param }: { step_param: string } = useParams();
  const history = useHistory();
  const [nftCreateProgress, setNFTcreateProgress] = useState<number>(0);
  const { width } = useWindowDimensions();
  const [step, setStep] = React.useState(0);
  const [stepsVisible, setStepsVisible] = useState<boolean>(true);
  const [isMinting, setMinting] = useState<boolean>(false);
  const [nft, setNft] = useState<{ metadataAccount: StringPublicKey } | undefined>(undefined);
  const [files, setFiles] = useState<File[]>([]);
  const [isArtist, setIsArtist] = useState<boolean>(false);
  const [attributes, setAttributes] = useState<IMetadataExtension>({
    name: "",
    symbol: "",
    description: "",
    external_url: "",
    image: "",
    animation_url: undefined,
    attributes: undefined,
    seller_fee_basis_points: 1000,
    creators: [],
    properties: {
      files: [],
      category: MetadataCategory.Image,
    },
  });

  const publicKey = wallet.publicKey;

  const userAuth = localStorage.getItem(`soloAuth${publicKey?.toBase58()}`)
    ? JSON.parse(localStorage.getItem(`soloAuth${publicKey?.toBase58()}`) as string).jwt_token
    : false;

  const gotoStep = useCallback(
    (_step: number) => {
      const newPath = `/solo-art/create/${_step}`;
      history.push(newPath);
      if (_step === 0) setStepsVisible(true);
    },
    [history]
  );

  useEffect(() => {
    if (step_param && wallet.publicKey) {
      setStep(parseInt(step_param));
    } else {
      gotoStep(0);
    }
  }, [step_param]);

  // useEffect(() => {
  //   if (step_param && wallet.publicKey) {setStep(parseInt(step_param));}
  //   else{ gotoStep(0);}
  // }, [step_param, gotoStep, wallet]);

  const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 10,
      left: "calc(-50% + 16px)",
      right: "calc(50% + 16px)",
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: "#784af4",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: "#784af4",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
      borderTopWidth: 3,
      borderRadius: 1,
    },
  }));

  const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
    ({ theme, ownerState }) => ({
      color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
      display: "flex",
      height: 22,
      alignItems: "center",
      ...(ownerState.active && {
        color: "#784af4",
      }),
      "& .QontoStepIcon-completedIcon": {
        color: "#784af4",
        zIndex: 1,
        fontSize: 18,
      },
      "& .QontoStepIcon-circle": {
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: "currentColor",
      },
    })
  );

  function QontoStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    return (
      <QontoStepIconRoot ownerState={{ active }} className={className}>
        {completed ? (
          <CheckCircleIcon className="QontoStepIcon-completedIcon" />
        ) : (
          <div className="QontoStepIcon-circle" />
        )}
      </QontoStepIconRoot>
    );
  }

  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundColor: "#2ea1e9",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundColor: "#2ea1e9",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#333333",
      borderRadius: 1,
    },
  }));

  const ColorlibStepIconRoot = styled("div")<{
    ownerState: { completed?: boolean; active?: boolean };
  }>(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#333333",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    ...(ownerState.active && {
      backgroundColor: "#2ea1e9",
      boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    }),
    ...(ownerState.completed && {
      backgroundColor: "#2ea1e9",
    }),
  }));

  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    const icons: { [index: string]: React.ReactElement | string } = {
      1: <ClipboardCheckIcon className="w-5 h-5" />,
      2: <CloudUploadIcon className="w-5 h-5" />,
      3: <InformationCircleIcon className="w-5 h-5" />,
      4: "◎",
      5: <PaperAirplaneIcon className="w-5 h-5" />,
    };

    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }

  const steps = ["pick category", "upload assets", "enter info", "set royalties", "launch"];

  // store files
  const mint = async () => {
    const metadata = {
      name: attributes.name,
      symbol: attributes.symbol,
      creators: attributes.creators,
      description: attributes.description,
      sellerFeeBasisPoints: attributes.seller_fee_basis_points,
      image: attributes.image,
      animation_url: attributes.animation_url,
      attributes: attributes.attributes,
      external_url: attributes.external_url,
      properties: {
        files: attributes.properties.files,
        category: attributes.properties?.category,
      },
    };
    setStepsVisible(false);
    setMinting(true);

    try {
      const artistAuthed = await fetch(GET_AUTHED_DETAILS, {
        method: "GET",
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${userAuth}`,
        },
      }).then((res) => res.json());
      //@ts-ignore
      if (artistAuthed.wallet_key == wallet.publicKey.toBase58()) {
        setIsArtist(true);
      }
    } catch (error) {
      console.log(error);
    }

    try {
      const _nft = await mintNFT(
        connection,
        wallet,
        env,
        files,
        metadata,
        setNFTcreateProgress,
        attributes.properties?.maxSupply
      );

      if (_nft) setNft(_nft);

      setAlertMessage("");
    } catch (e: any) {
      setAlertMessage(e.message);
    } finally {
      setMinting(false);
    }
  };

  return (
    <Page title="Mint | DigitalEyes">
      {wallet.publicKey ? (
        <div className="solo-art-create-container">
          <div className="grid grid-cols-3 my-20 justify-items-center">
            {stepsVisible && userAuth && (
              <div className="col-span-3 w-full">
                <Stepper alternativeLabel activeStep={step} connector={<ColorlibConnector />}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel StepIconComponent={ColorlibStepIcon}>
                        <p className="text-white text-md lowercase">{label}</p>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </div>
            )}
            <div className="col-span-3 mt-8 w-full">
              {step === 0 && !userAuth && <SoloWalletSigner path={`/solo-art/create/0`} />}
              {step === 0 && userAuth && (
                <CategoryStep
                  confirm={(category: MetadataCategory) => {
                    setAttributes({
                      ...attributes,
                      properties: {
                        ...attributes.properties,
                        category,
                      },
                    });
                    gotoStep(1);
                  }}
                />
              )}
              {step === 1 && (
                <UploadStep
                  attributes={attributes}
                  setAttributes={setAttributes}
                  files={files}
                  setFiles={setFiles}
                  confirm={() => gotoStep(2)}
                />
              )}

              {step === 2 && (
                <InfoStep
                  attributes={attributes}
                  files={files}
                  setAttributes={setAttributes}
                  confirm={() => gotoStep(3)}
                />
              )}
              {step === 3 && (
                <RoyaltiesStep
                  attributes={attributes}
                  confirm={() => gotoStep(4)}
                  setAttributes={setAttributes}
                />
              )}
              {step === 4 && (
                <LaunchStep
                  attributes={attributes}
                  files={files}
                  confirm={() => gotoStep(5)}
                  connection={connection}
                />
              )}
              {step === 5 && (
                <WaitingStep
                  mint={mint}
                  minting={isMinting}
                  step={nftCreateProgress}
                  confirm={() => gotoStep(6)}
                />
              )}
              {step === 6 && <Congrats nft={nft} alert={alertMessage} isArtist={isArtist} />}
              {0 < step && step < 5 && (
                <div className="flex justify-center">
                  <button
                    className="w-full md:w-1/2 border rounded-lg my-4 p-2 border-color-main-gray-medium"
                    onClick={() => gotoStep(step - 1)}
                  >
                    Back
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-4 mt-20 sm:mx-6 lg:mx-auto relative py-10 px-7">
          <IKImage
            urlEndpoint={IMAGE_KIT_ENDPOINT_OLDURL}
            path="/logo/digitaleyes-cant-find.gif"
            alt="digital eyes cant find"
            className="w-auto h-12 absolute -top-5 mx-auto my-0 left-0 right-0"
          />
          <div className="text-center lowercase">
            <h2 className="text-xl sm:text-3xl font-extrabold">
              please connect your wallet to proceed.
            </h2>
            <div className="my-6">
              <p className="text-xl font-light lowercase">
                if you're a little lost for wallets, have a look at this{" "}
                <a
                  className="text-blue-500 underline"
                  href={"https://docs.solana.com/wallet-guide"}
                  target="_blank"
                >
                  guide
                </a>
              </p>
              <p className="text-md font-light lowercase">
                we recommend{" "}
                <a
                  className="text-blue-500 underline"
                  href={"https://phantom.app/"}
                  target="_blank"
                >
                  {" "}
                  phantom wallet
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
};

const CategoryStep = (props: { confirm: (category: MetadataCategory) => void }) => {
  const { width } = useWindowDimensions();
  return (
    <>
      <div className="text-white text-center">
        <div className="text-3xl">create a new item</div>
        <div className="opacity-60">select your category below</div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-10 justify-items-center">
        <div className="w-full">
          <button
            className="w-full border border-color-main-gray-medium rounded-lg p-3 my-2 hover:bg-color-main-gray-medium"
            onClick={() => props.confirm(MetadataCategory.Image)}
          >
            <div>
              <div className="text-lg lowercase">Image</div>
              <div className="text-xs opacity-60">JPG, PNG, GIF</div>
            </div>
          </button>
        </div>
        <div className="w-full">
          <button
            className="w-full border border-color-main-gray-medium rounded-lg p-3 my-2 hover:bg-color-main-gray-medium"
            onClick={() => props.confirm(MetadataCategory.Video)}
          >
            <div>
              <div className="text-lg lowercase">Video</div>
              <div className="text-xs opacity-60">MP4, MOV</div>
            </div>
          </button>
        </div>
        <div className="w-full">
          <button
            className="w-full border border-color-main-gray-medium rounded-lg p-3 my-2 hover:bg-color-main-gray-medium"
            onClick={() => props.confirm(MetadataCategory.Audio)}
          >
            <div>
              <div className="text-lg lowercase">Audio</div>
              <div className="text-xs opacity-60">MP3, WAV, FLAC</div>
            </div>
          </button>
        </div>
        <div className="w-full">
          <button
            className="w-full border border-color-main-gray-medium rounded-lg p-3 my-2 hover:bg-color-main-gray-medium"
            onClick={() => props.confirm(MetadataCategory.VR)}
          >
            <div>
              <div className="text-lg lowercase">AR/3D</div>
              <div className="text-xs opacity-60">GLB</div>
            </div>
          </button>
        </div>
        <div className="col-span-2 w-1/2 md:col-span-1 md:w-full">
          <button
            className="w-full border border-color-main-gray-medium rounded-lg p-3 my-2 hover:bg-color-main-gray-medium"
            onClick={() => props.confirm(MetadataCategory.HTML)}
          >
            <div>
              <div className="text-lg lowercase">HTML Asset</div>
              <div className="text-xs opacity-60">HTML</div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

const UploadStep = (props: {
  attributes: IMetadataExtension;
  setAttributes: (attr: IMetadataExtension) => void;
  files: File[];
  setFiles: (files: File[]) => void;
  confirm: () => void;
}) => {
  const [coverFile, setCoverFile] = useState<File | undefined>(props.files?.[0]);
  const [mainFile, setMainFile] = useState<File | undefined>(props.files?.[1]);
  const [coverArtError, setCoverArtError] = useState<string | undefined>(undefined);
  const [mainFileError, setMainFileError] = useState<string | undefined>(undefined);

  const [customURL, setCustomURL] = useState<string>("");
  const [customURLErr, setCustomURLErr] = useState<string>("");
  const disableContinue =
    !coverFile || !!customURLErr || mainFileError != undefined || coverArtError != undefined;

  useEffect(() => {
    props.setAttributes({
      ...props.attributes,
      properties: {
        ...props.attributes.properties,
        files: [],
      },
    });
  }, []);

  const uploadMsg = (category: MetadataCategory) => {
    switch (category) {
      case MetadataCategory.Audio:
        return "Upload your audio creation (MP3, FLAC, WAV)";
      case MetadataCategory.Image:
        return "Upload your image creation (PNG, JPG, GIF)";
      case MetadataCategory.Video:
        return "Upload your video creation (MP4, MOV, GLB)";
      case MetadataCategory.VR:
        return "Upload your AR/VR creation (GLB)";
      case MetadataCategory.HTML:
        return "Upload your HTML File (HTML)";
      default:
        return "Please go back and choose a category";
    }
  };

  const acceptableFiles = (category: MetadataCategory) => {
    switch (category) {
      case MetadataCategory.Audio:
        return ".mp3,.flac,.wav";
      case MetadataCategory.Image:
        return ".png,.jpg,.gif";
      case MetadataCategory.Video:
        return ".mp4,.mov,.webm";
      case MetadataCategory.VR:
        return ".glb";
      case MetadataCategory.HTML:
        return ".html";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="w-full text-center">
        <div className="text-3xl ">Now, let's upload your creation</div>
        <div className="text-sm opacity-60 pt-5 px-32">
          Your file will be uploaded to the decentralized web via Arweave. Depending on file type,
          can take up to 1 minute. Arweave is a new type of storage that backs data with sustainable
          and perpetual endowments, allowing users and developers to truly store data forever – for
          the very first time.
        </div>
      </div>
      <div className="pt-5 flex flex-col justify-items-center">
        {props.attributes.properties?.category == MetadataCategory.Image ? (
          <div className="text-lg text-center">Upload your image (PNG, JPG, GIF, SVG)</div>
        ) : (
          <div className="text-lg text-center">
            Upload a cover for your creation (PNG, JPG, GIF, SVG)
          </div>
        )}
        <Dragger
          accept=".png,.jpg,.gif,.mp4,.svg"
          className="bg-color-main-gray-medium w-full rounded-lg p-10 my-3 shadow-lg"
          multiple={false}
          customRequest={(info) => {
            // dont upload files here, handled outside of the control
            info?.onSuccess?.({}, null as any);
          }}
          fileList={coverFile ? [coverFile as any] : []}
          onChange={async (info) => {
            const file = info.file.originFileObj;

            if (!file) {
              return;
            }

            const sizeKB = file.size / 1024;
            const rgx: any = new RegExp("^[A-Za-z0-9_.s]+$");
            if (!rgx.test(file.name)) {
              setCoverArtError(
                `No special characters or spaces allowed in filename! Please rename your file and try again`
              );
              return;
            }
            if (sizeKB < 25) {
              setCoverArtError(
                `The file ${file.name} is too small. It is ${
                  Math.round(10 * sizeKB) / 10
                }KB but should be at least 25KB.`
              );
              return;
            }

            if (sizeKB > 9000) {
              setCoverArtError(
                `The file ${file.name} is too big. It is ${
                  Math.round(10 * sizeKB) / 10
                }KB but should be a maximum of 9000KB.`
              );
              return;
            }

            setCoverFile(file);
            setCoverArtError(undefined);
          }}
        >
          <div className="text-md opacity-60">Upload Image (PNG, JPG, GIF, SVG)</div>
          {coverArtError ? (
            <div className="text-red-500 text-sm">{coverArtError}</div>
          ) : (
            <div className="text-sm opacity-50 lowercase">Click to Browse</div>
          )}
        </Dragger>
      </div>
      {props.attributes.properties?.category !== MetadataCategory.Image && (
        <Row className="content-action" style={{ marginBottom: 5, marginTop: 30 }}>
          <h3 className="text-center">{uploadMsg(props.attributes.properties?.category)}</h3>
          <Dragger
            accept={acceptableFiles(props.attributes.properties?.category)}
            className="bg-color-main-gray-medium w-full rounded-lg p-10 my-3 shadow-lg"
            multiple={false}
            customRequest={(info) => {
              // dont upload files here, handled outside of the control
              info?.onSuccess?.({}, null as any);
            }}
            fileList={mainFile ? [mainFile as any] : []}
            onChange={async (info) => {
              const file = info.file.originFileObj;

              if (!file) {
                return;
              }

              const sizeKB = file.size / 1024;
              const rgx: any = new RegExp("^[A-Za-z0-9_.s]+$");
              if (!rgx.test(file.name)) {
                setMainFileError(
                  `No special characters or spaces allowed in filename! Please rename your file and try again`
                );
                return;
              }

              if (sizeKB > 9000) {
                setMainFileError(
                  `The file ${file.name} is too big. It is ${
                    Math.round(10 * sizeKB) / 10
                  }KB but should be a maximum of 9000KB.`
                );
                return;
              }

              // Reset image URL
              setCustomURL("");
              setCustomURLErr("");
              setMainFileError(undefined);

              setMainFile(file);
            }}
            onRemove={() => {
              setMainFile(undefined);
            }}
          >
            <div className="text-md opacity-60">Upload Your Creation</div>
            {mainFileError ? (
              <div className="text-red-500 text-sm">{mainFileError}</div>
            ) : (
              <div className="text-sm opacity-50 lowercase">Click to Browse</div>
            )}
          </Dragger>
        </Row>
      )}
      {/**<Form.Item
        className="my-3"
        label={<div className="text-lg opacity-80">or use absolute URL to content</div>}
        labelAlign="left"
        colon={false}
        validateStatus={customURLErr ? "error" : "success"}
        help={customURLErr}
      >
        <Input
          className="w-full md:w-3/4 p-2 my-2 bg-transparent border border-color-main-gray-medium rounded-lg"
          disabled={!!mainFile}
          placeholder="http://example.com/path/to/image"
          value={customURL}
          onChange={(ev) => setCustomURL(ev.target.value)}
          onFocus={() => setCustomURLErr("")}
          onBlur={() => {
            if (!customURL) {
              setCustomURLErr("");
              return;
            }

            try {
              // Validate URL and save
              new URL(customURL);
              setCustomURL(customURL);
              setCustomURLErr("");
            } catch (e) {
              console.error(e);
              setCustomURLErr("Please enter a valid absolute URL");
            }
          }}
        />
      </Form.Item>*/}
      <div className="flex justify-center">
        <button
          disabled={disableContinue}
          onClick={() => {
            props.setAttributes({
              ...props.attributes,
              properties: {
                ...props.attributes.properties,
                files: [coverFile, mainFile, customURL]
                  .filter((f) => f)
                  .map((f) => {
                    const uri = typeof f === "string" ? f : f?.name || "";
                    const type =
                      typeof f === "string" || !f
                        ? "unknown"
                        : f.type || getLast(f.name.split(".")) || "unknown";

                    return {
                      uri,
                      type,
                    } as MetadataFile;
                  }),
              },
              image: coverFile?.name || "",
              animation_url:
                props.attributes.properties?.category !== MetadataCategory.Image && customURL
                  ? customURL
                  : mainFile && mainFile.name,
            });
            const files = [coverFile, mainFile].filter((f) => f) as File[];

            props.setFiles(files);
            props.confirm();
          }}
          style={{ marginTop: 24 }}
          className="btn w-full md:w-1/2"
        >
          Continue to Mint
        </button>
      </div>
    </>
  );
};

interface Royalty {
  creatorKey: string;
  amount: number;
}

const useArtworkFiles = (files: File[], attributes: IMetadataExtension) => {
  const [data, setData] = useState<{ image: string; animation_url: string }>({
    image: "",
    animation_url: "",
  });

  useEffect(() => {
    if (attributes.image) {
      const file = files.find((f) => f.name === attributes.image);
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          setData((data: any) => {
            return {
              ...(data || {}),
              image: (event.target?.result as string) || "",
            };
          });
        };
        if (file) reader.readAsDataURL(file);
      }
    }

    if (attributes.animation_url) {
      const file = files.find((f) => f.name === attributes.animation_url);
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          setData((data: any) => {
            return {
              ...(data || {}),
              animation_url: (event.target?.result as string) || "",
            };
          });
        };
        if (file) reader.readAsDataURL(file);
      }
    }
  }, [files, attributes]);

  return data;
};

const InfoStep = (props: {
  attributes: IMetadataExtension;
  files: File[];
  setAttributes: (attr: IMetadataExtension) => void;
  confirm: () => void;
}) => {
  const [creators, setCreators] = useState<Array<any>>([]);
  const [royalties, setRoyalties] = useState<Array<Royalty>>([]);
  const [videoFailed, setVideoFailed] = useState<boolean>();
  const { image, animation_url } = useArtworkFiles(props.files, props.attributes);
  const audio: IAudioContext = useContext(AudioContext);
  const [form] = Form.useForm();

  const animationUrlExt = props.attributes.animation_url
    ? props.attributes.animation_url.includes("?ext=")
      ? props.attributes.animation_url.split("?ext=").pop()
      : props.attributes.animation_url.split(".").pop()
    : null;

  const videoFile =
    props.attributes?.properties?.files && typeof props.attributes?.properties?.files !== "string"
      ? props.attributes?.properties?.files instanceof Array
        ? props.attributes?.properties?.files.find((videoFile: any) =>
            videoFile.type.includes("video")
          )
        : props.attributes?.properties?.category === "video" && props.attributes?.properties?.files
      : null;

  const videoFallback = (parentNode: any) => {
    setVideoFailed(true);
  };
  const imageOutput =
    image && isImageInCache(image) ? (
      <IKImage
        urlEndpoint={IMAGE_KIT_ENDPOINT_OLDURL}
        path={getImagePath(image)}
        transformation={[]}
        className="shadow-md w-full h-auto rounded-md"
      />
    ) : (
      <img src={image} className="shadow-md w-full h-auto rounded-md" />
    );
  useEffect(() => {
    setRoyalties(
      creators.map((creator) => ({
        creatorKey: creator.key,
        amount: Math.trunc(100 / creators.length),
      }))
    );
  }, [creators]);
  return (
    <>
      <div className="w-full">
        <div className="text-3xl text-center">Describe your item</div>
        <div className="text-md opacity-60 my-2 text-center">
          Provide detailed description of your creative process to engage with your audience.
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="w-full">
          {props.attributes.image && (
            <div className="rounded-md overflow-hidden mb-4">
              {animation_url &&
                (props.attributes?.properties?.category === "vr" || animationUrlExt === "glb") && (
                  <div className="shadow-md w-full md:h-96 h-auto block">
                    <model-viewer
                      camera-controls
                      poster={animation_url}
                      src={animation_url}
                    ></model-viewer>
                  </div>
                )}
              {animation_url &&
                (props.attributes?.properties?.category === "html" ||
                  animationUrlExt === "html") && (
                  <HTMLContent animationUrl={animation_url}></HTMLContent>
                )}
              {animation_url && props.attributes?.properties?.category === "video" && !videoFailed && (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="shadow-md w-full h-auto block"
                  onError={videoFallback}
                >
                  <source src={animation_url} type="video/ogg" />
                  <source src={animation_url} type="video/mp4" />
                </video>
              )}
              {animation_url &&
                (props.attributes?.properties?.category === "audio" ||
                  animationUrlExt === "mp3" ||
                  animationUrlExt === "audio") && (
                  <>
                    {imageOutput}
                    <button
                      className="hover:text-white flex space-x-2 items-center py-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        audio.trigger(animation_url);
                      }}
                    >
                      <MusicNoteIcon className="h-4 w-4 group-hover:text-white transition 150 ease-in-out" />
                      <span>{audio.isPlaying ? "Pause Audio" : "Play Audio"}</span>
                    </button>
                  </>
                )}

              {!animation_url && (!videoFile || videoFailed) && imageOutput}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1">
          <div className="my-4">
            <span className="text-xl">Title</span>
          </div>
          <div>
            <Input
              autoFocus
              className="w-full p-4 bg-transparent border border-color-main-gray-medium rounded-lg"
              placeholder="Max 50 characters"
              value={props.attributes.name}
              onChange={(info) => {
                props.setAttributes({
                  ...props.attributes,
                  name: info.target.value,
                });
              }}
            />
          </div>
          {/* <div className="action-field">
            <span className="field-title">Symbol</span></div><div>
            <Input
              className="input"
              placeholder="Max 10 characters"
              allowClear
              value={props.attributes.symbol}
              onChange={info =>
                props.setAttributes({
                  ...props.attributes,
                  symbol: info.target.value,
                })
              }
            />
          </div> */}

          <div className="my-4">
            <span className="text-xl">Description</span>
          </div>
          <div>
            <Input.TextArea
              className="w-full p-4 bg-transparent border border-color-main-gray-medium rounded-lg"
              placeholder="Max 500 characters"
              value={props.attributes.description}
              onChange={(info) =>
                props.setAttributes({
                  ...props.attributes,
                  description: info.target.value,
                })
              }
            />
          </div>
          {/**<div className="my-4">
            <span className="text-xl">Maximum Supply</span>
          </div>
          <div>
            <Input
              placeholder="quantity"
              type="number"
              onChange={(val: any) => {
                props.setAttributes({
                  ...props.attributes,
                  properties: {
                    ...props.attributes.properties,
                    maxSupply: val.target.value,
                  },
                });
              }}
              className="w-full  p-4 bg-transparent border border-color-main-gray-medium rounded-lg"
            />
          </div>*/}
          <div className="my-4">
            <span className="text-xl">Attributes</span>
          </div>
          <Form name="dynamic_attributes" form={form} autoComplete="off">
            <Form.List name="attributes">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey }) => (
                    <Space key={key} align="baseline" className="flex flex-row flex-wrap w-full">
                      <div>
                        <Form.Item
                          name={[name, "trait_type"]}
                          fieldKey={[fieldKey, "trait_type"]}
                          hasFeedback
                        >
                          <Input
                            className="bg-transparent rounded-lg border border-color-main-gray-medium p-2 my-1 text-xs  md:text-md inline"
                            placeholder="trait_type (Optional)"
                          />
                        </Form.Item>
                      </div>
                      <div>
                        <Form.Item
                          name={[name, "value"]}
                          fieldKey={[fieldKey, "value"]}
                          rules={[{ required: true, message: "Missing value" }]}
                          hasFeedback
                        >
                          <Input
                            className="bg-transparent rounded-lg border border-color-main-gray-medium p-2 my-1 text-xs md:text-md inline"
                            placeholder="value"
                          />
                        </Form.Item>
                      </div>
                      <div>
                        <Form.Item
                          name={[name, "display_type"]}
                          fieldKey={[fieldKey, "display_type"]}
                          hasFeedback
                        >
                          <Input
                            className="bg-transparent rounded-lg border border-color-main-gray-medium p-2 my-1 text-xs md:text-md inline"
                            placeholder="display_type (Optional)"
                          />
                        </Form.Item>
                      </div>
                      <MinusCircleIcon
                        className="w-4 h-4 md:w-6 md:h-6  opacity-60 hover:opacity-100 cursor-pointer inline"
                        onClick={() => remove(name)}
                      />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusCircleIcon className="w-7 h-7 inline mx-2" />}
                      className="mb-6 opacity-60 inline mx-2 hover:opacity-100"
                    >
                      Add attribute
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Button
          type="primary"
          size="large"
          onClick={() => {
            form.validateFields().then((values) => {
              const nftAttributes = values.attributes;
              // value is number if possible
              for (const nftAttribute of nftAttributes || []) {
                const newValue = Number(nftAttribute.value);
                if (!isNaN(newValue)) {
                  nftAttribute.value = newValue;
                }
              }
              props.setAttributes({
                ...props.attributes,
                attributes: nftAttributes,
              });

              props.confirm();
            });
          }}
          className="btn w-full md:w-1/2"
        >
          Continue to royalties
        </Button>
      </div>
    </>
  );
};

const RoyaltiesSplitter = (props: {
  creators: Array<any>;
  creatorsAdd: Array<any>;
  setCreators: Function;
  royalties: Array<Royalty>;
  setRoyalties: Function;
  isShowErrors?: boolean;
}) => {
  const [value, setValue] = React.useState<number>(30);
  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  return (
    <div>
      <div>
        {props.creators.map((creator, idx) => {
          const royalty = props.royalties.find((royalty) => royalty.creatorKey === creator.key);
          if (!royalty) return null;

          const amt = royalty.amount;

          const handleChangeShare = (event: Event, newAmt: number | number[]) => {
            props.setRoyalties(
              props.royalties.map((_royalty) => {
                return {
                  ..._royalty,
                  amount: _royalty.creatorKey === royalty.creatorKey ? newAmt : _royalty.amount,
                };
              })
            );
          };

          return (
            <div>
              <div className="grid grid-cols-3 gap-4 my-5">
                <div className="col-span-2 truncate">{creator.value}</div>
                {props.creators.indexOf(creator) > 0 ? (
                  <button
                    onClick={(e) => {
                      props.setCreators(
                        props.creatorsAdd.filter((_creator) => _creator.value !== creator.value)
                      );
                    }}
                  >
                    <TrashIcon className="w-6 h-6" />
                  </button>
                ) : (
                  <div />
                )}
                <Slider
                  aria-label="Volume"
                  defaultValue={100}
                  value={amt}
                  onChange={handleChangeShare}
                  valueLabelDisplay="auto"
                  className="w-1/4"
                />
                <div> {amt}% </div>
                {props.isShowErrors && amt === 0 && (
                  <div>
                    <div className="text-color-red-500 text-sm">
                      The split percentage for this creator cannot be 0%.
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RoyaltiesStep = (props: {
  attributes: IMetadataExtension;
  setAttributes: (attr: IMetadataExtension) => void;
  confirm: () => void;
}) => {
  // const file = props.attributes.image;
  const { wallet, publicKey, connected } = useWallet0();
  const [creators, setCreators] = useState<Array<any>>([]);
  const [fixedCreators, setFixedCreators] = useState<Array<any>>([]);
  const [royalties, setRoyalties] = useState<Array<Royalty>>([]);
  const [totalRoyaltyShares, setTotalRoyaltiesShare] = useState<number>(0);
  const [showCreatorsModal, setShowCreatorsModal] = useState<boolean>(false);
  const [isShowErrors, setIsShowErrors] = useState<boolean>(false);
  const [additionalCreatorAddr, setAdditionalCreatorAddr] = useState<string>();

  useEffect(() => {
    if (publicKey) {
      const key = publicKey.toBase58();
      setFixedCreators([
        {
          key,
          label: shortenAddress(key),
          value: key,
        },
      ]);
    }
  }, [connected, setCreators]);

  useEffect(() => {
    setRoyalties(
      [...fixedCreators, ...creators].map((creator) => ({
        creatorKey: creator.key,
        amount: Math.trunc(100 / [...fixedCreators, ...creators].length),
      }))
    );
  }, [creators, fixedCreators]);

  useEffect(() => {
    // When royalties changes, sum up all the amounts.
    const total = royalties.reduce((totalShares, royalty) => {
      return totalShares + royalty.amount;
    }, 0);

    setTotalRoyaltiesShare(total);
  }, [royalties]);

  return (
    <>
      <div className="w-full">
        <div className="text-4xl lowercase text-center">Set royalties and creator splits</div>
        <div className="text-md opacity-70 my-2 lowercase text-center">
          Royalties ensure that you continue to get compensated for your work after its initial
          sale.
        </div>
      </div>
      <div className="grid grid-cols-1 flex justify-items-center">
        <div className="w-3/4">
          <div className="my-10">
            <label className="text-xl lowercase my-10">
              Royalty Percentage
              <div className="text-sm opacity-70 my-2 lowercase">
                This is how much of each secondary sale will be paid out to the creators.
              </div>
              <Input
                autoFocus
                type="number"
                min={0}
                max={100}
                defaultValue={10}
                placeholder="Between 0 and 100"
                onChange={(e) => {
                  const val: any = e.target.value;

                  props.setAttributes({
                    ...props.attributes,
                    seller_fee_basis_points: val * 100,
                  });
                }}
                className="bg-transparent rounded-lg border border-color-main-gray-medium w-1/8 text-4xl p-2 mr-2"
              />
              %
            </label>
          </div>
          <div className="w-full">
            <div className="text-xl mt-8 mb-3 lowercase">Creators Split</div>
            <div className="text-md opacity-70 my-3 lowercase">
              This is how much of the proceeds from the initial sale and any royalties will be split
              out amongst the creators.
            </div>
            <RoyaltiesSplitter
              creators={[...fixedCreators, ...creators]}
              creatorsAdd={[...creators]}
              setCreators={setCreators}
              royalties={royalties}
              setRoyalties={setRoyalties}
              isShowErrors={isShowErrors}
            />
          </div>
          <div className="my-5">
            <Input
              placeholder="add another creator wallet address"
              className="bg-transparent border border-color-main-gray-medium p-3 rounded-lg w-1/2 mr-3 truncate"
              value={additionalCreatorAddr}
              onChange={(e) => setAdditionalCreatorAddr(e.target.value)}
            ></Input>
            <button
              onClick={(e) => {
                if (additionalCreatorAddr) {
                  const key = additionalCreatorAddr;
                  setCreators([
                    ...creators,
                    {
                      key,
                      label: shortenAddress(key),
                      value: key,
                    },
                  ]);
                }
                setAdditionalCreatorAddr("");
              }}
            >
              <PlusCircleIcon className="w-4 h-4 opacity-70 inline" />
              <div className="inline text-md">add creator</div>
            </button>
          </div>
        </div>
      </div>

      {royalties?.length > 1 && (
        <div className="text-red-500 py-8 w-full md:w-3/4">
          it is your responsibility to ensure correct wallet addresses are entered. DigitalEyes will
          not be responsible for any errors.
        </div>
      )}
      {isShowErrors && totalRoyaltyShares !== 100 && (
        <div className="text-red-500 py-3">
          The split percentages for each creator must add up to 100%. Current total split percentage
          is {totalRoyaltyShares}%.
        </div>
      )}
      <div className="flex justify-center">
        <button
          disabled={props.attributes.seller_fee_basis_points >= 10000 || totalRoyaltyShares !== 100}
          onClick={() => {
            // Find all royalties that are invalid (0)
            const zeroedRoyalties = royalties.filter((royalty) => royalty.amount === 0);

            if (zeroedRoyalties.length !== 0 || totalRoyaltyShares !== 100) {
              // Contains a share that is 0 or total shares does not equal 100, show errors.
              setIsShowErrors(true);
              return;
            }

            const creatorStructs: Creator[] = [...fixedCreators, ...creators].map(
              (c) =>
                new Creator({
                  address: c.value,
                  verified: c.value === publicKey?.toBase58(),
                  share:
                    royalties.find((r) => r.creatorKey === c.value)?.amount ||
                    Math.round(100 / royalties.length),
                })
            );

            const share = creatorStructs.reduce((acc, el) => (acc += el.share), 0);
            if (share > 100 && creatorStructs.length) {
              creatorStructs[0].share -= share - 100;
            }
            props.setAttributes({
              ...props.attributes,
              creators: creatorStructs,
            });
            props.confirm();
          }}
          className="btn w-full md:w-1/2"
        >
          Continue to review
        </button>
      </div>
    </>
  );
};

const LaunchStep = (props: {
  confirm: () => void;
  attributes: IMetadataExtension;
  files: File[];
  connection: Connection;
}) => {
  const [cost, setCost] = useState(0);
  const { image, animation_url } = useArtworkFiles(props.files, props.attributes);
  const [videoFailed, setVideoFailed] = useState<boolean>();
  const audio: IAudioContext = useContext(AudioContext);

  const files = props.files;
  const metadata = props.attributes;
  useEffect(() => {
    const rentCall = Promise.all([
      props.connection.getMinimumBalanceForRentExemption(MintLayout.span),
      props.connection.getMinimumBalanceForRentExemption(MAX_METADATA_LEN),
    ]);
    if (files.length)
      getAssetCostToStore([...files, new File([JSON.stringify(metadata)], "metadata.json")]).then(
        async (lamports) => {
          const sol = lamports / LAMPORT_MULTIPLIER;

          // TODO: cache this and batch in one call
          const [mintRent, metadataRent] = await rentCall;

          // const uriStr = 'x';
          // let uriBuilder = '';
          // for (let i = 0; i < MAX_URI_LENGTH; i++) {
          //   uriBuilder += uriStr;
          // }

          const additionalSol = (metadataRent + mintRent) / LAMPORT_MULTIPLIER;

          // TODO: add fees based on number of transactions and signers
          setCost(sol + additionalSol);
        }
      );
  }, [files, metadata, setCost]);

  const animationUrlExt = props.attributes.animation_url
    ? props.attributes.animation_url.includes("?ext=")
      ? props.attributes.animation_url.split("?ext=").pop()
      : props.attributes.animation_url.split(".").pop()
    : null;

  const imageOutput =
    image && isImageInCache(image) ? (
      <IKImage
        urlEndpoint={IMAGE_KIT_ENDPOINT_OLDURL}
        path={getImagePath(image)}
        transformation={[]}
        className="shadow-md w-full h-auto rounded-md"
      />
    ) : (
      <img src={image} className="shadow-md w-full h-auto rounded-md" />
    );

  const videoFile =
    props.attributes?.properties?.files && typeof props.attributes?.properties?.files !== "string"
      ? props.attributes?.properties?.files instanceof Array
        ? props.attributes?.properties?.files.find((videoFile: any) =>
            videoFile.type.includes("video")
          )
        : props.attributes?.properties?.category === "video" && props.attributes?.properties?.files
      : null;
  const videoFallback = (parentNode: any) => {
    console.log("video preview Failed");
    setVideoFailed(true);
  };

  return (
    <>
      <div>
        <div className="lowercase text-4xl text-center">Launch your creation</div>
        <div className="text-md opacity-70 my-5 text-center">quick review before we proceed</div>
      </div>
      <div className="grid grid-cols-1 gap-4 justify-items-center ">
        <div className="w-full md:w-1/2">
          {props.attributes.image && (
            <div className="rounded-md overflow-hidden mb-4">
              {animation_url &&
                (props.attributes?.properties?.category === "vr" || animationUrlExt === "glb") && (
                  <div className="shadow-md w-full md:h-96 h-auto block">
                    <model-viewer
                      camera-controls
                      poster={animation_url}
                      src={animation_url}
                    ></model-viewer>
                  </div>
                )}
              {animation_url &&
                (props.attributes?.properties?.category === "html" ||
                  animationUrlExt === "html") && (
                  <HTMLContent animationUrl={animation_url}></HTMLContent>
                )}
              {animation_url && props.attributes?.properties?.category === "video" && !videoFailed && (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="shadow-md w-full h-auto block"
                  onError={videoFallback}
                >
                  <source src={animation_url} type="video/ogg" />
                  <source src={animation_url} type="video/mp4" />
                </video>
              )}
              {animation_url &&
                (props.attributes?.properties?.category === "audio" ||
                  animationUrlExt === "mp3" ||
                  animationUrlExt === "audio") && (
                  <>
                    {imageOutput}
                    <button
                      className="hover:text-white flex space-x-2 items-center py-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        audio.trigger(animation_url);
                      }}
                    >
                      <MusicNoteIcon className="h-4 w-4 group-hover:text-white transition 150 ease-in-out" />
                      <span>{audio.isPlaying ? "Pause Audio" : "Play Audio"}</span>
                    </button>
                  </>
                )}

              {!animation_url && (!videoFile || videoFailed) && imageOutput}
            </div>
          )}
        </div>
        <div>
          <div className="text-xl mt-5 inline">royalty percentage</div>
          <div className="text-3xl ml-5 my-3 inline">
            {props.attributes.seller_fee_basis_points / 100} %
          </div>
        </div>
        <div>
          <div className="text-xl mt-5 inline">Approx. Cost to create</div>
          <div className="text-3xl ml-5 my-3 inline">◎{cost.toFixed(5)} </div>
        </div>
        <div>
          <div className="text-sm mt-5">
            Above cost is an approximation only. Final charges will be confirmed with your 2 wallet
            transactions during the minting process
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button onClick={props.confirm} className="btn w-full md:w-1/2 mt-5">
          Pay with SOL
        </button>
      </div>
    </>
  );
};

const WaitingStep = (props: {
  mint: Function;
  minting: boolean;
  confirm: Function;
  step: number;
}) => {
  const { width } = useWindowDimensions();

  useEffect(() => {
    const func = async () => {
      await props.mint();
      props.confirm();
    };
    func();
  }, []);

  const QStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
    ({ theme, ownerState }) => ({
      color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
      display: "flex",
      height: 22,
      alignItems: "center",
      ...(ownerState.active && {
        color: "#784af4",
      }),
      "& .QontoStepIcon-completedIcon": {
        color: "#784af4",
        zIndex: 1,
        fontSize: 18,
      },
      "& .QontoStepIcon-circle": {
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: "currentColor",
      },
    })
  );

  function QStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    return (
      <QStepIconRoot ownerState={{ active }} className={className}>
        {completed ? (
          <CheckCircleIcon className="QStepIcon-completedIcon" />
        ) : (
          <div className="QStepIcon-circle" />
        )}
      </QStepIconRoot>
    );
  }

  const ClibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundColor: "#2ea1e9",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundColor: "#2ea1e9",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#333333",
      borderRadius: 1,
    },
  }));

  const ClibStepIconRoot = styled("div")<{
    ownerState: { completed?: boolean; active?: boolean };
  }>(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#333333",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    ...(ownerState.active && {
      backgroundColor: "#2ea1e9",
      boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    }),
    ...(ownerState.completed && {
      backgroundColor: "#2ea1e9",
    }),
  }));

  function ClibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    return (
      <ClibStepIconRoot ownerState={{ completed, active }} className={className}>
        {completed ? (
          <CheckCircleIcon className="w-4 h-4" />
        ) : active ? (
          <LoadingWidget />
        ) : (
          <TicketIcon className="w-4 h-4" />
        )}
      </ClibStepIconRoot>
    );
  }

  const steps = [
    "Minting",
    "Preparing Assets",
    "Signing Metadata transaction",
    "Sending Transaction to Solana",
    "Waiting for Initial Confirmation",
    "Waiting for Final Confirmation",
    "Uploading to Arweave",
    "Updating Metadata",
    "Signing Token Transaction",
    ,
    ,
    ,
    ,
    ,
    ,
    ,
  ];

  const setIconForStep = (currentStep: number, componentStep: any) => {
    if (currentStep === componentStep) {
      return <LoadingOutlined />;
    }
    return null;
  };

  return (
    <div>
      <div className="text-3xl lowercase text-center mb-10">minting in progress...</div>
      {width > 768 ? (
        <>
          <Stepper alternativeLabel activeStep={props.step} connector={<ClibConnector />}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={ClibStepIcon}>
                  <p className="text-white text-xs lowercase">{label}</p>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </>
      ) : (
        <>
          <Stepper orientation="vertical" activeStep={props.step}>
            <Step>
              <StepLabel>
                <div className="text-sm lowercase text-white">pick category</div>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>
                <div className="text-sm lowercase text-white">Preparing Assets</div>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>
                <div className="text-sm lowercase text-white">Signing Metadata Transaction</div>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>
                <div className="text-sm lowercase text-white">Sending Transaction to Solana</div>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>
                <div className="text-sm lowercase text-white">Waiting for Initial Confirmation</div>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>
                <div className="text-sm lowercase text-white">Waiting for Final Confirmation</div>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>
                <div className="text-sm lowercase text-white">Uploading to Arweave</div>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>
                <div className="text-sm lowercase text-white">updating Metadata</div>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>
                <div className="text-sm lowercase text-white">signing Token Transaction</div>
              </StepLabel>
            </Step>
          </Stepper>
        </>
      )}
    </div>
  );
};

const Congrats = (props: {
  nft?: {
    metadataAccount: StringPublicKey;
  };
  alert?: string;
  isArtist?: boolean;
}) => {
  const history = useHistory();

  const newTweetURL = () => {
    const params = {
      text: "I've created a new NFT artwork on DigitalEyes #solo, check it out!",
      url: `${window.location.origin}/itemt/${props.nft?.metadataAccount.toString()}`,
      hashtags: "NFT,Crypto,DigitalEyes,solo",
      related: "DigitalEyes,Solana,DE",
    };
    const queryParams = new URLSearchParams(params).toString();
    return `https://twitter.com/intent/tweet?${queryParams}`;
  };

  if (props.alert) {
    // TODO  - properly reset this components state on error
    return (
      <div className="grid grid-cols-1 justify-items-center">
        <div className="text-xl text-red-500 text-center w-full">Sorry, there was an error!</div>
        <p className="text-center text-md w-full">{props.alert}</p>
        <Button
          className="border border-color-main-gray-lighter hover:bg-color-main-gray-lighter w-full md:w-1/2 rounded-lg p-3 mt-3"
          onClick={(_) => history.push("/art/create")}
        >
          Back to Create NFT
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="text-3xl text-white text-center lowercase my-5">
        Congratulations, you created an NFT!
      </div>
      <div className="grid grid-cols-1 gap-4 justify-items-center mt-5">
        {!props.isArtist && (
          <div>
            <p className="text-lg text-center opacity-70 my-2">
              it seems like you don't have a #solo profile yet.
            </p>
            <p className="text-md text-center opacity-70 my-2">
              {" "}
              #solo profiles let buyers see all your creations in one spot.
            </p>
            <p className="text-sm text-center opacity-70 my-2">
              {" "}
              it's your own space in DigitalEyes metaverse, be sure to express yourself!{" "}
            </p>
          </div>
        )}
        {!props.isArtist && (
          <Button
            className="w-full md:w-1/2 btn mt-2 mb-4"
            onClick={(_) => history.push("/solo-settings")}
          >
            <span>create a #solo profile</span>
          </Button>
        )}
        <Button
          className="border w-full md:w-1/2 p-3 rounded-lg border-color-main-gray-lighter hover:bg-color-main-gray-lighter"
          onClick={(_) => history.push(`${ROUTES.WALLET}`)}
        >
          <span>see it in your wallet</span>
        </Button>
        {/**<Button
          disabled
          className="border w-full md:w-1/2 p-3 rounded-lg border-color-main-gray-lighter hover:bg-color-main-gray-lighter"
          onClick={(_) => window.open(newTweetURL(), "_blank")}
        >
          <span>share it on Twitter</span>
        </Button>*/}
      </div>
    </>
  );
};
