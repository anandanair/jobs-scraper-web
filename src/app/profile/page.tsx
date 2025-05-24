import { getUserProfileByEmail } from "@/lib/supabase/queries";
import { Resume } from "@/types";

export default async function Profile() {
  const userProfile: Resume | null = await getUserProfileByEmail();

  if (!userProfile) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p>User profile not found or email not configured.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{userProfile.name}'s Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
          <p>
            <strong>Email:</strong> {userProfile.email}
          </p>
          <p>
            <strong>Phone:</strong> {userProfile.phone}
          </p>
          <p>
            <strong>Location:</strong> {userProfile.location}
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Links</h2>
          {userProfile.links?.linkedin && (
            <p>
              <strong>LinkedIn:</strong>{" "}
              <a
                href={userProfile.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {userProfile.links.linkedin}
              </a>
            </p>
          )}
          {userProfile.links?.github && (
            <p>
              <strong>GitHub:</strong>{" "}
              <a
                href={userProfile.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {userProfile.links.github}
              </a>
            </p>
          )}
          {userProfile.links?.portfolio && (
            <p>
              <strong>Portfolio:</strong>{" "}
              <a
                href={userProfile.links.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {userProfile.links.portfolio}
              </a>
            </p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Summary</h2>
        <p>{userProfile.summary}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Skills</h2>
        {/* Assuming skills is an object; adjust if it's an array or string */}
        <div className="flex flex-wrap gap-2">
          {typeof userProfile.skills === "object" &&
            userProfile.skills !== null &&
            Object.keys(userProfile.skills).map((skill) => (
              <span
                key={skill}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {skill}{" "}
                {Array.isArray(userProfile.skills[skill])
                  ? `(${userProfile.skills[skill].join(", ")})`
                  : ""}
              </span>
            ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Experience</h2>
        {userProfile.experience.map((exp, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg">
            <h3 className="text-lg font-medium">
              {exp.job_title} at {exp.company}
            </h3>
            <p className="text-sm text-gray-600">{exp.location}</p>
            <p className="text-sm text-gray-600">
              {exp.start_date} - {exp.end_date || "Present"}
            </p>
            {exp.description && (
              <p className="mt-2 text-gray-700">{exp.description}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Education</h2>
        {userProfile.education.map((edu, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg">
            <h3 className="text-lg font-medium">
              {edu.degree} in {edu.field_of_study}
            </h3>
            <p className="text-gray-700">{edu.institution}</p>
            <p className="text-sm text-gray-600">
              {edu.start_year} - {edu.end_year || "Present"}
            </p>
          </div>
        ))}
      </div>

      {userProfile.projects && userProfile.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Projects</h2>
          {userProfile.projects.map((proj, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg">
              <h3 className="text-lg font-medium">{proj.name}</h3>
              {proj.description && (
                <p className="text-gray-700">{proj.description}</p>
              )}
              {proj.technologies && proj.technologies.length > 0 && (
                <p className="mt-1 text-sm">
                  <strong>Technologies:</strong> {proj.technologies.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {userProfile.certifications && userProfile.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Certifications</h2>
          {userProfile.certifications.map((cert, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg">
              <h3 className="text-lg font-medium">{cert.name}</h3>
              {cert.issuer && (
                <p className="text-gray-700">Issuer: {cert.issuer}</p>
              )}
              {cert.year && (
                <p className="text-sm text-gray-600">Year: {cert.year}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {userProfile.languages && userProfile.languages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Languages</h2>
          {/* Assuming languages is an array of objects like [{ language: 'English', proficiency: 'Native' }] */}
          <ul className="list-disc list-inside">
            {userProfile.languages.map((lang, index) => (
              <li key={index}>
                {lang.language}
                {lang.proficiency ? ` (${lang.proficiency})` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      {userProfile.resume_link && (
        <div className="mt-6">
          <a
            href={userProfile.resume_link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            View Full Resume (PDF)
          </a>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-8">
        Profile created at:{" "}
        {new Date(userProfile.created_at).toLocaleDateString()} | Last parsed
        at: {new Date(userProfile.parsed_at).toLocaleDateString()}
        {userProfile.last_updated &&
          ` | Last updated at: ${new Date(
            userProfile.last_updated
          ).toLocaleDateString()}`}
      </p>
    </div>
  );
}
