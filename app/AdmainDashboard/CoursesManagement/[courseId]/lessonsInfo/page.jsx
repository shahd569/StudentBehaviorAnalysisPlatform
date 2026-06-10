"use client";

import {
  faBookOpen,
  faFile,
  faVideo,
  faClipboardList,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { Plyr } from "plyr-react";
import dynamic from "next/dynamic";

import "plyr-react/plyr.css";
import Image from "next/image";

import { useParams, useRouter } from "next/navigation";

import { useEffect, useMemo, useRef, useState } from "react";
const Plyr = dynamic(
  async () => {
    const mod = await import("plyr-react");
    return mod.Plyr;
  },
  {
    ssr: false,
  },
);
export default function CourseDetails() {
  const [lessons, setLessons] = useState([]);

  const [selectedVideo, setSelectedVideo] = useState(null);

  const [courseInfo, setCourseInfo] = useState([]);

  const videoRef = useRef(null);

  const params = useParams();

  const id = Number(params.courseId);
  const router = useRouter();

  // جلب الدروس

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch(
          `/api/studentDashboard/studentCourses/coursesCards/${id}/courseDetails/courseLessonsList`,
        );

        const data = await res.json();

        if (res.ok) {
          setLessons(data || []);

          if (data.length > 0 && data[0].lessonVideos.length > 0) {
            setSelectedVideo(data[0].lessonVideos[0]);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchLessons();
  }, [id]);

  // جلب معلومات المقرر

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch(
          "/api/studentDashboard/studentCourses/coursesCards",
        );

        const data = await res.json();

        if (res.ok) {
          setCourseInfo(data || []);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchInfo();
  }, []);

  const currentCourse = useMemo(() => {
    return courseInfo.find((c) => c.id === id);
  }, [courseInfo, id]);

  return (
    <div
      style={{
        padding: "25px",
        background: "#F5F5F5",
        minHeight: "100vh",
      }}
    >
      {currentCourse && (
        <div
          style={{
            width: "100%",
            background: "#bfdbf1",
            borderRadius: "18px",
            padding: "20px",
            display: "flex",
            direction: "rtl",
            alignItems: "center",
            gap: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "170px",
              height: "100px",
              position: "relative",
              borderRadius: "18px",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <Image
              src={
                currentCourse.coursePictureUrl || "/uploads/default-course.jpg"
              }
              alt="course"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              flexGrow: 1,
            }}
          >
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                margin: 0,
                color: "#000",
                textAlign: "right",
              }}
            >
              {currentCourse.courseName}
            </h1>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                direction: "rtl",
              }}
            >
              <div
                style={{
                  width: "55px",
                  height: "55px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                <Image
                  src={
                    currentCourse.instructorProfilePictureUrl ||
                    "/uploads/default-user.png"
                  }
                  alt="teacher"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "17px",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  د. {currentCourse.instructorName}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          gap: "20px",
          alignItems: "flex-start",
        }}
      >
        {/* الفيديو */}

        <div
          style={{
            flex: 1,
            background: "#fff",
            borderRadius: "18px",
            padding: "22px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          {selectedVideo ? (
            <>
              <div
                style={{
                  width: "100%",
                  // maxHeight: "70vh",
                  background: "#000",
                  borderRadius: "16px",
                  overflow: "hidden",
                  // display: "flex",
                  // justifyContent: "center",
                  // alignItems: "center",
                }}
              >
                <Plyr
                  ref={videoRef}
                  source={{
                    type: "video",
                    sources: [
                      {
                        src: selectedVideo.videoUrl,
                        provider: "html5",
                        type: "video/mp4",
                      },
                    ],
                  }}
                  options={{
                    controls: [
                      "play-large",
                      "restart",
                      "rewind",
                      "play",
                      "fast-forward",
                      "progress",
                      "current-time",
                      "duration",
                      "mute",
                      "volume",
                      "settings",
                      "fullscreen",
                    ],

                    settings: ["speed"],

                    speed: {
                      selected: 1,
                      options: [0.5, 0.75, 1, 1.25, 1.5, 2],
                    },
                  }}
                />
              </div>
              {/* وصف الفيديو */}

              <div
                style={{
                  marginTop: "22px",
                }}
              >
                <h2
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    marginBottom: "12px",
                  }}
                >
                  وصف الفيديو
                </h2>

                <p
                  style={{
                    color: "#666",
                    lineHeight: "2",
                    fontSize: "18px",
                  }}
                >
                  {selectedVideo.videoDescription || "لا يوجد وصف لهذا الفيديو"}
                </p>
              </div>
              {/* <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  borderRadius: "12px",
                  background: "#F3F4F6",
                }}
              > */}
              {/* قائمة تشغيل الفيديوهات */}

              <div
                style={{
                  marginTop: "18px",
                  background: "#fff",
                  borderRadius: "14px",
                  border: "1px solid #E5E7EB",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "14px",
                    fontWeight: "bold",
                    fontSize: "18px",
                    borderBottom: "1px solid #EEE",
                  }}
                >
                  فيديوهات الدرس
                </div>

                {lessons
                  .find((lesson) =>
                    lesson.lessonVideos.some(
                      (v) => v.videoId === selectedVideo.videoId,
                    ),
                  )
                  ?.lessonVideos.map((video, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedVideo(video)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        justifyContent: "flex-end",
                        flexDirection: "row-reverse",
                        padding: "12px 14px",
                        cursor: "pointer",
                        background:
                          selectedVideo.videoId === video.videoId
                            ? "#EFF6FF"
                            : "#fff",
                        borderBottom: "1px solid #F1F1F1",
                        transition: "0.2s",
                      }}
                    >
                      <div
                        style={{
                          width: "45px",
                          height: "45px",
                          borderRadius: "10px",
                          background: "#DBEAFE",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faVideo}
                          style={{
                            color: "#2563EB",
                            fontSize: "18px",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          flex: 1,
                          textAlign: "right",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: "600",
                            fontSize: "15px",
                          }}
                        >
                          {video.videoTitle || `الفيديو ${index + 1}`}
                        </div>

                        <div
                          style={{
                            fontSize: "13px",
                            color: "#777",
                            marginTop: "3px",
                          }}
                        >
                          اضغط للمشاهدة
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              {/* </div> */}
            </>
          ) : (
            <div>لا يوجد فيديو</div>
          )}
        </div>

        {/* قائمة الدروس */}

        <div
          style={{
            width: "340px",
            minWidth: "340px",
            background: "#fff",
            borderRadius: "18px",
            overflow: "hidden",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              padding: "22px",
              fontWeight: "bold",
              fontSize: "22px",
              borderBottom: "1px solid #E5E5E5",
            }}
          >
            قائمة الدروس
          </div>

          {lessons.map((lesson, index) => (
            <div
              key={index}
              style={{
                padding: "18px",
                borderBottom: "1px solid #EFEFEF",
              }}
            >
              {/* عنوان الدرس */}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "18px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faBookOpen}
                    style={{
                      color: "#666",
                      fontSize: "24px",
                    }}
                  />

                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  >
                    {lesson.lessonTitle}
                  </span>
                  <div
                    style={{
                      background: "#E8F1FF",
                      color: "#2563EB",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      fontSize: "13px",
                      fontWeight: "bold",
                    }}
                  >
                    {lesson.lessonVideos.length} فيديو
                  </div>
                </div>
              </div>

              {/* العناصر */}

              <div
                style={{
                  display: "flex",
                  //   flexWrap: "wrap",
                  //   gap: "12px",
                  //   alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                {/* ملف */}

                <a
                  href={lesson.lessonFileUrl || "#"}
                  target={lesson.lessonFileUrl ? "_blank" : "_self"}
                  onClick={(e) => {
                    if (!lesson.lessonFileUrl) {
                      e.preventDefault();
                    }
                  }}
                  style={{
                    textDecoration: "none",
                    color: lesson.lessonFileUrl ? "#555" : "#AAA",
                    textAlign: "center",
                    cursor: lesson.lessonFileUrl ? "pointer" : "default",
                    opacity: lesson.lessonFileUrl ? 1 : 0.5,
                    pointerEvents: "auto",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faFile}
                    style={{
                      color: lesson.lessonFileUrl ? "#F4C542" : "#CCC",
                      color: "#F4C542",
                      fontSize: "30px",
                    }}
                  />

                  <div
                    style={{
                      marginTop: "5px",
                      fontSize: "14px",
                    }}
                  >
                    الملف
                  </div>
                </a>

                {/* فيديوهات الدرس */}

                <div
                  onClick={() => {
                    if (lesson.lessonVideos.length > 0) {
                      setSelectedVideo(lesson.lessonVideos[0]);
                    }
                  }}
                  style={{
                    cursor:
                      lesson.lessonVideos.length > 0 ? "pointer" : "default",

                    textAlign: "center",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faVideo}
                    style={{
                      color: "#4C8BF5",
                      fontSize: "30px",
                    }}
                  />

                  <div
                    style={{
                      marginTop: "5px",
                      fontSize: "14px",
                      color: "#555",
                    }}
                  >
                    فيديو ({lesson.lessonVideos.length})
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
