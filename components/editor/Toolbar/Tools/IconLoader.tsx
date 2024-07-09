import Image from "next/image";

const placeholder =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOUlZOtBwABkQDZtOsNkwAAAABJRU5ErkJggg==";

export const IconLoader = ({ icon }) => (
  <Image
    src={`${icon}`}
    alt={""}
    width="0"
    height="0"
    sizes="100vw"
    style={{ width: "24px", height: "24px" }}
    loading="lazy"
    blurDataURL={placeholder}
    placeholder="blur"
  />
);

export default IconLoader;
