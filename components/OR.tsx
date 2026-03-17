import Image from "next/image";
import styles from "./or.module.css";

const OR = () => {
  return (
    <div className={styles.orWrapper}>
      <Image
        src="/image/or.svg"
        alt="or"
        width={220}
        height={140}
        priority
        className={styles.orImage}
      />
    </div>
  );
};

export default OR;
