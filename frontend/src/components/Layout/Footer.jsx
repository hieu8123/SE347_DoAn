import logo from "../../Assests/Image/SHOPAO.png";
import "./Footer.css";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import {
  footercompanyLinks,
  footerProductLinks,
  footerSupportLinks,
} from "../../static/data";

const Footer = () => {
  const facebookLink = "https://www.facebook.com/dophunghia0505";
  const instagramLink = "https://www.instagram.com/n_bot05/";
  const twitterLink = "https://www.twitter.com/example";
  const youtubeLink = "https://www.youtube.com/@uitchannel2305";

  return (
    <div className="bg-[#000] text-white">
      <div className="grid grid-cols-1 sm:gird-cols-3 lg:grid-cols-4 gap-6 sm:px-8 px-5 py-16 sm:text-center md:grid-cols-2">
        <ul className=" text-center md:text-start flex md:block flex-col items-center">
          <img
            src={logo}
            alt=""
            style={{ filter: "brightness(0) invert(1)", width: "265px" }}
          />
          <br />
          <p>Thuận lòng người bán, vừa ý người mua</p>
          <div className="flex items-center mt-[15px]">
            <a href={facebookLink} target="_blank" rel="noopener noreferrer">
              <AiFillFacebook size={25} className="cursor-pointer" />
            </a>
            <a
              href={twitterLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: "15px", cursor: "pointer" }}
            >
              <AiOutlineTwitter size={25} />
            </a>
            <a
              href={instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: "15px", cursor: "pointer" }}
            >
              <AiFillInstagram size={25} />
            </a>
            <a
              href={youtubeLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: "15px", cursor: "pointer" }}
            >
              <AiFillYoutube size={25} />
            </a>
          </div>
        </ul>

        <ul className="text-center md:text-start">
          <h1 className="mb-1 font-semibold">Công ty</h1>
          {footerProductLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300
                   text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <div className=" md:text-start Footer_map">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15672.924961103905!2d106.8030541!3d10.8700089!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527587e9ad5bf%3A0xafa66f9c8be3c91!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgVGjDtG5nIHRpbiAtIMSQSFFHIFRQLkhDTQ!5e0!3m2!1svi!2s!4v1703040885544!5m2!1svi!2s"
              width="250"
              height="150"
              style={{ borderRadius: "5px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </ul>

        <ul className="text-center md:text-start">
          <h1 className="mb-1 font-semibold">Shop</h1>
          {footercompanyLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300
                   text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="text-center md:text-start">
          <h1 className="mb-1 font-semibold">Chăm sóc khách hàng</h1>
          {footerSupportLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300
                   text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
          {/* <div className=" md:text-start Footer_map">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.2946148745295!2d106.61381087481921!3d10.865181857550803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752a10b0f0554f%3A0x769800e8967d6703!2zNzAgVMO0IEvDvSwgVMOibiBDaMOhbmggSGnhu4dwLCBRdeG6rW4gMTIsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1690547993088!5m2!1svi!2s"
              width="250"
              height="150"
              style={{ borderRadius: "5px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div> */}
        </ul>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10
         text-center pt-2 text-gray-400 text-sm pb-8 "
      >
        <span>© 2023 4D Market. All rights reserved.</span>
        <span>Điều khoản · Chính sách bảo mật</span>
        <div className="sm:block flex items-center justify-center w-full footer_logo-payment">
          <img
            src="https://hamart-shop.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffooter-payment.a37c49ac.png&w=640&q=75"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
