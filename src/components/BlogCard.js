import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { logoM } from "../config/constants";
import "./BlogCard.css";

const BlogCard = ({ text, title, ownerOf, externalUrl }) => {
  const length = 100;
  const trimmedString = useMemo(() => text.substring(0, length), [text]);

  const account = useMemo(
    () => `${ownerOf.slice(0, 4)}...${ownerOf.slice(38)}`,
    [ownerOf]
  );

  const navigate = useNavigate();

  const clickHandler = useCallback(() => {
    const lastSegment = externalUrl.split("/").pop();
    navigate(`/blog/${lastSegment}`);
  }, [externalUrl, navigate]);

  return (
    <div className="blog" onClick={clickHandler}>
      <div className="blog_leftSide">
        <div className="blogger">
          <span className="blogger_name">{account}</span>
          <span className="blogger_date">Mar 21</span>
        </div>
        <div className="blog_title">
          <h3>{title}</h3>
        </div>
        <div className="blog_content">
          <p>{trimmedString}...</p>
        </div>
      </div>
      <div className="blog_rightSide">
        <div>
          <img className="blog_image" src={logoM} alt="Logo" />
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
