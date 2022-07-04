import { useCallback, useState } from "react";
import {
  useMoralisFile,
  useMoralis,
  useWeb3ExecuteFunction,
} from "react-moralis";

import { logoM } from "../config/constants";

import "./NewStory.css";

const NewStory = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const onTitleChange = useCallback((event) => {
    setTitle(event.target.value);
  }, []);

  const onTextChange = useCallback((event) => {
    setText(event.target.value);
  }, []);

  const { saveFile } = useMoralisFile();
  const { Moralis, account } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const onMintSuccess = useCallback(() => {
    alert("Successful Mint");
    setText("");
    setTitle("");
  }, []);

  const onMintError = useCallback((error) => {
    alert(error.message);
  }, []);

  const mint = useCallback(
    async (account, uri) => {
      let options = {
        contractAddress: "0x8a5B7773dDf5Dec5326130C172247C5FD36A7551",
        functionName: "safeMint",
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                internalType: "string",
                name: "uri",
                type: "string",
              },
            ],
            name: "safeMint",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
        ],
        params: {
          to: account,
          uri,
        },
        msgValue: Moralis.Units.ETH(1),
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: onMintSuccess,
        onError: onMintError,
      });
    },
    [Moralis.Units, contractProcessor, onMintError, onMintSuccess]
  );

  const uploadNftMetadata = useCallback(
    async (url) => {
      const metadataNft = {
        image: logoM,
        description: title,
        externalUrl: url,
      };
      const resultNft = await saveFile(
        "metadata.json",
        { base64: btoa(JSON.stringify(metadataNft)) },
        {
          type: "base64",
          saveIPFS: true,
        }
      );

      return resultNft;
    },
    [saveFile, title]
  );

  const uploadFile = useCallback(async () => {
    const textArray = text.split();

    const metadata = {
      title,
      text: textArray,
    };

    try {
      const result = await saveFile(
        "myblog.json",
        { base64: btoa(JSON.stringify(metadata)) },
        { type: "base64", saveIPFS: true }
      );
      const nftResult = await uploadNftMetadata(result.ipfs());
      await mint(account, nftResult.ipfs());
    } catch (error) {
      alert(error.message);
    }
  }, [account, mint, saveFile, text, title, uploadNftMetadata]);

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();
      uploadFile();
    },
    [uploadFile]
  );

  return (
    <>
      <div>
        <form className="writeForm" onSubmit={onSubmit}>
          <div className="writeFormGroup">
            <input
              className="writeInput"
              placeholder="Title"
              type="text"
              autoFocus
              value={title}
              onChange={onTitleChange}
            />
          </div>
          <div className="writeFormGroup">
            <textarea
              className="writeInput writeText"
              placeholder="Tell your story..."
              autoFocus
              value={text}
              onChange={onTextChange}
            />
          </div>

          <button className="writeSubmit" type="submit">
            Publish
          </button>
        </form>
      </div>
    </>
  );
};

export default NewStory;
