import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Button } from "web3uikit";
import { useNavigate } from "react-router-dom";
import { useMoralisWeb3Api, useMoralis } from "react-moralis";

import BlogCard from "../components/BlogCard";

import "./MyBlogs.css";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState();

  const web3Api = useMoralisWeb3Api();
  const { isInitialized, isAuthenticated, account } = useMoralis();

  const [blogsContent, setBlogsContent] = useState();

  const fetchAllNfts = useCallback(async () => {
    const options = {
      chain: "mumbai",
      address: account,
      token_address: "0x8a5B7773dDf5Dec5326130C172247C5FD36A7551",
    };

    const nfts = await web3Api.account.getNFTsForContract(options);

    const tokenUri = nfts?.result?.map((data) => {
      const { metadata, owner_of } = data;

      if (metadata) {
        const metadataObj = JSON.parse(metadata);
        const { externalUrl } = metadataObj;
        return { externalUrl, owner_of };
      } else {
        return undefined;
      }
    });

    setBlogs(tokenUri);
  }, [account, web3Api.account]);

  const fetchBlogsContent = useCallback(async () => {
    const limit5 = blogs?.slice(0, 5);

    if (limit5) {
      const contentBlog = await Promise.all(
        limit5.map(async ({ externalUrl, owner_of }) => {
          const res = await axios.get(externalUrl);
          const text = res.data.text.toString();
          const title = res.data.title;
          return { title, text, owner_of, externalUrl };
        })
      );

      setBlogsContent(contentBlog);
    }
  }, [blogs]);

  useEffect(() => {
    if (blogs && !blogsContent) {
      fetchBlogsContent();
    }
  }, [blogs, blogsContent, fetchBlogsContent]);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      fetchAllNfts();
    }
  }, [fetchAllNfts, isAuthenticated, isInitialized]);

  const navigate = useNavigate();

  const clickHandler = useCallback(() => {
    navigate("/newStory");
  }, [navigate]);

  return (
    <>
      <div>
        <div className="myBlogsHeader">Your Blogs</div>
        {blogsContent && blogsContent.length > 0 ? (
          blogsContent.map((blog, index) => {
            const { title, text, owner_of, externalUrl } = blog;
            return (
              <BlogCard
                key={index}
                title={title}
                text={text}
                ownerOf={owner_of}
                externalUrl={externalUrl}
              />
            );
          })
        ) : (
          <div
            style={{
              fontSize: "30px",
              width: "100%",
              marginLeft: "40%",
            }}
          >
            <p>No Blogs Yet</p>
            <Button text="Create one" onClick={clickHandler} />
          </div>
        )}
      </div>
    </>
  );
};

export default MyBlogs;
