import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { SettingsAtom } from "utils/atoms";

export const PageSettings = () => {
  const [settings, setSettings] = useRecoilState(SettingsAtom);

  const [data, setData] = useState(settings);
  const [name, setName] = useState(data?.name || "");
  const [nameOk, setNameOk] = useState(null);
  const [saving, setSaving] = useState(false);
  const [domainData, setDomainData] = useState(null);

  const save = async () => {
    setSaving(true);
    const { company, companyType, companyLocation } = data;
    let result = null;

    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company,
          companyType,
          companyLocation,
          name,

          _id: settings._id,
        }),
      });

      result = await res.json();
    } catch (e) {
      console.error(e);
    }

    console.log(result);

    result && setSettings(result);
    setSaving(false);
    // setDialogOpen(false);
  };

  const change = (key, val) => {
    const a = { ...data };

    a[key] = val;
    setData(a);
  };

  const checkName = async (name) => {
    setName(name);
    const res = await fetch("/api/check", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    let result = null;

    try {
      result = await res.json();
    } catch (e) {
      console.error(e);
    }

    if (result.name) {
      return setNameOk(false);
    }

    change("name", name);
    setNameOk(true);
  };

  useEffect(() => {
    const run = () => {
      fetch("/api/domain", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain: settings.domain }),
      }).then(async (res) => {
        const r = await res.json();
        setDomainData(r);

        console.log("domainData", r);
      });
    };

    run();
  }, [settings?.domain]);

  const inputClass = "input  ";

  if (!settings) {
    return null;
  }

  return (
    <form
      autoComplete="false"
      onSubmit={(e) => {
        e.preventDefault();
        if (saving) return;
        save();
      }}
    >
      <div className="space-y-6  pb-4 sm:pb-6 px-3 xl:pb-8">
        <div className="flex flex-col gap-6">
          <h3 className="text-xl mb-3">AI Settings</h3>
          <p>
            These settings are used to help assist AI with creating various
            things for your pages.
          </p>

          <div className="flex flex-col gap-6">
            <div>
              <label htmlFor="companyName">Company Name</label>
              <input
                id="companyName"
                type="text"
                autoFocus={settings.company}
                placeholder="Your Company"
                required={true}
                defaultValue={settings.company}
                onChange={(e) => change("company", e.target.value)}
                className={inputClass}
                data-gramm="false"
              />
            </div>
            <div>
              <label htmlFor="companyType">Company Type</label>
              <input
                id="companyType"
                type="text"
                autoFocus={settings.companyType}
                placeholder="ecommerce, finance"
                required={true}
                defaultValue={settings.companyType}
                onChange={(e) => change("companyType", e.target.value)}
                className={inputClass}
                data-gramm="false"
              />
            </div>
            <div>
              <label htmlFor="companylocation">Company Location</label>
              <input
                id="companyLocation"
                type="text"
                autoFocus={settings.companyLocation}
                placeholder="Los Angeles, CA"
                required={true}
                defaultValue={settings.companyLocation}
                onChange={(e) => change("companyLocation", e.target.value)}
                className={inputClass}
                data-gramm="false"
              />
            </div>
          </div>
        </div>

        <div className="w-full">
          <button
            className={`${saving ? "bg-primary-300" : "bg-primary-500"
              } btn w-full p-3`}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
};
