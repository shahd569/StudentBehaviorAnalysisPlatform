SELECT
  u.id AS "studentId",
  ((u."firstName" || ' ' :: text) || u."lastName") AS "studentName",
  c."instructorId" AS "teacherId",
  COALESCE(avg(qa.score), (0) :: double precision) AS "academicScore",
  (
    (
      (count(DISTINCT asub.id)) :: double precision / (NULLIF(count(DISTINCT a.id), 0)) :: double precision
    ) * (100) :: double precision
  ) AS "commitmentScore",
  (
    (
      COALESCE(
        (
          SELECT
            count(DISTINCT (us."startTime") :: date) AS count
          FROM
            "UserSession" us
          WHERE
            (
              (us."studentId" = u.id)
              AND (
                us."startTime" >= (CURRENT_DATE - '7 days' :: INTERVAL)
              )
            )
        ),
        (0) :: bigint
      ) * 20
    ) / 7
  ) AS "activityScore"
FROM
  (
    (
      (
        (
          (
            (
              "Users" u
              JOIN "Enrollment" e ON ((u.id = e."studentId"))
            )
            JOIN "Course" c ON ((e."courseId" = c.id))
          )
          LEFT JOIN "QuizAttempt" qa ON ((u.id = qa."studentId"))
        )
        LEFT JOIN "Lesson" l ON ((c.id = l."courseId"))
      )
      LEFT JOIN "Assignment" a ON ((l.id = a."lessonId"))
    )
    LEFT JOIN "AssignmentSubmission" asub ON (
      (
        (u.id = asub."studentId")
        AND (a.id = asub."assignmentId")
      )
    )
  )
WHERE
  (u.role = 'STUDENT' :: "userRole")
GROUP BY
  u.id,
  u."firstName",
  u."lastName",
  c."instructorId";