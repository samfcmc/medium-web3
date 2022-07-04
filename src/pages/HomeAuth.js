import { useState, useEffect, useCallback } from "react";
import "./HomeAuth.css";
import axios from "axios";
import { useMoralisWeb3Api } from "react-moralis";

import BlogCard from "../components/BlogCard";

const HomeAuth = () => {
  const [blogs, setBlogs] = useState();

  const [blogsContent, setBlogsContent] = useState();

  const web3API = useMoralisWeb3Api();

  const fetchAllNfts = useCallback(async () => {
    const options = {
      chain: "mumbai",
      address: "0x8a5B7773dDf5Dec5326130C172247C5FD36A7551",
    };

    const nfts = await web3API.token.getNFTOwners(options);

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
  }, [web3API.token]);

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
    if (!blogs) {
      fetchAllNfts();
    }
  }, [blogs, fetchAllNfts]);

  return (
    <div className="homeAuth_container">
      <div className="homeAuth_header">Recommended Blogs</div>
      <div className="homeAuth_blogs">
        {blogsContent &&
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
          })}
      </div>
    </div>
  );
};

export default HomeAuth;
